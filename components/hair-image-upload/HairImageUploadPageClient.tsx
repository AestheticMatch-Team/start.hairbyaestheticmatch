"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type DragEvent,
} from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { funnelStepHref } from "@/lib/funnel";
import {
  isUploadAnglePhotoSuccess,
  parseUploadAnglePhotoBody,
  userMessageFromUploadAnglePhotoFailure,
} from "@/lib/monday/parse-upload-angle-photo-response";
import {
  createHairAnglePreviewObjectUrl,
  isHairAngleImagePick,
} from "./hair-angle-preview-url";
import {
  HAIR_IMAGE_SLOTS,
  PROCEDURE,
  type HairImageSlotId,
  type SlotUploadState,
} from "./hair-image-upload-shared";
import HairImageUploadStepIntro from "./HairImageUploadStepIntro";
import HairImageUploadStepReview from "./HairImageUploadStepReview";
import HairImageUploadStepUpload from "./HairImageUploadStepUpload";
import shell from "./HairImageUploadShell.module.scss";
import Link from "next/link";

type Step = 1 | 2 | 3;

function buildInitialUploads(
  initialUploadedAngles: Record<string, boolean> | undefined,
): Record<HairImageSlotId, SlotUploadState> {
  return HAIR_IMAGE_SLOTS.reduce(
    (acc, s) => {
      acc[s.id] =
        initialUploadedAngles?.[s.id] === true
          ? { status: "done", preview: "" }
          : { status: "empty" };
      return acc;
    },
    {} as Record<HairImageSlotId, SlotUploadState>,
  );
}

function isInitialAllDone(initialUploadedAngles: Record<string, boolean> | undefined): boolean {
  if (!initialUploadedAngles) return false;
  return HAIR_IMAGE_SLOTS.every((s) => initialUploadedAngles[s.id] === true);
}

export default function HairImageUploadPageClient({
  mondayItemId,
  uploadToken,
  initialUploadedAngles,
}: {
  mondayItemId?: string;
  uploadToken?: string;
  initialUploadedAngles?: Record<string, boolean>;
}) {
  const router = useRouter();
  const [step, setStep] = useState<Step>(() => (isInitialAllDone(initialUploadedAngles) ? 3 : 1));
  const [activeSlotId, setActiveSlotId] = useState<HairImageSlotId>("hair_vertex");

  const [uploads, setUploads] = useState<Record<HairImageSlotId, SlotUploadState>>(() =>
    buildInitialUploads(initialUploadedAngles),
  );

  const [submitReviewLoading, setSubmitReviewLoading] = useState(false);
  const [loadingAnglePhotos, setLoadingAnglePhotos] = useState(() =>
    Boolean(mondayItemId?.trim()),
  );

  const inputRefs = useRef<Record<HairImageSlotId, HTMLInputElement | null>>(
    {} as Record<HairImageSlotId, HTMLInputElement | null>,
  );

  const idleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  /** Each step body is taller than the viewport; avoid landing mid-scroll after Continue / Back */
  useEffect(() => {
    const id = window.requestAnimationFrame(() => {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    });
    return () => window.cancelAnimationFrame(id);
  }, [step]);

  const resetIdleTimer = useCallback(() => {
    if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    idleTimerRef.current = setTimeout(() => {
      fetch("/api/lifecycle/photo-upload/idle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({}),
      }).catch(() => {});
    }, 30 * 60 * 1000);
  }, []);

  useEffect(() => {
    resetIdleTimer();
    const notifyExit = () => {
      try {
        const url = "/api/lifecycle/photo-upload/exit";
        if (typeof navigator !== "undefined" && "sendBeacon" in navigator) {
          const blob = new Blob([JSON.stringify({})], { type: "application/json" });
          navigator.sendBeacon(url, blob);
          return;
        }
        fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({}),
          keepalive: true,
        }).catch(() => {});
      } catch {
        // ignore
      }
    };
    window.addEventListener("pagehide", notifyExit);
    window.addEventListener("beforeunload", notifyExit);
    return () => {
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
      window.removeEventListener("pagehide", notifyExit);
      window.removeEventListener("beforeunload", notifyExit);
    };
  }, [resetIdleTimer]);

  useEffect(() => {
    if (!mondayItemId?.trim()) {
      setLoadingAnglePhotos(false);
      return;
    }
    let cancelled = false;
    setLoadingAnglePhotos(true);
    const params = new URLSearchParams({ itemId: mondayItemId.trim() });
    if (uploadToken?.trim()) params.set("token", uploadToken.trim());

    fetch(`/api/monday/angle-photos?${params.toString()}`)
      .then((r) => r.json())
      .then((data: { photos?: { angleId: string; url: string; assetId: string }[] }) => {
        const photos = data.photos;
        if (!photos?.length) return;
        setUploads((prev) => {
          const next = { ...prev };
          for (const p of photos) {
            const id = p.angleId as HairImageSlotId;
            if (!HAIR_IMAGE_SLOTS.some((s) => s.id === id)) continue;
            next[id] = { status: "done", preview: p.url, assetId: p.assetId };
          }
          return next;
        });
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setLoadingAnglePhotos(false);
      });

    return () => {
      cancelled = true;
    };
  }, [mondayItemId, uploadToken]);

  const doneCount = useMemo(
    () => HAIR_IMAGE_SLOTS.filter((s) => uploads[s.id].status === "done").length,
    [uploads],
  );

  const nextStepTitle = useMemo(() => {
    const missing = HAIR_IMAGE_SLOTS.find((s) => uploads[s.id].status !== "done");
    if (missing) return missing.title;
    return "All angles uploaded";
  }, [uploads]);

  const revokeIfObjectUrl = useCallback((url: string | undefined) => {
    if (url?.startsWith("blob:")) URL.revokeObjectURL(url);
  }, []);

  const setSlotState = useCallback((id: HairImageSlotId, next: SlotUploadState) => {
    setUploads((prev) => {
      const cur = prev[id];
      if (
        (cur.status === "done" || cur.status === "uploading") &&
        "preview" in cur &&
        cur.preview.startsWith("blob:")
      ) {
        const samePreview =
          (next.status === "done" || next.status === "uploading") &&
          "preview" in next &&
          next.preview === cur.preview;
        if (!samePreview) URL.revokeObjectURL(cur.preview);
      }
      return { ...prev, [id]: next };
    });
  }, []);

  const runUpload = useCallback(
    async (slotId: HairImageSlotId, file: File) => {
      if (!isHairAngleImagePick(file)) {
        toast.error("Please choose an image file.");
        return;
      }

      if (!mondayItemId?.trim()) {
        toast.error("Sign in or use your photo link from email so we can save your images.");
        return;
      }

      let localPreview: string;
      try {
        localPreview = await createHairAnglePreviewObjectUrl(file);
      } catch {
        toast.error("Could not load a preview for this file. Try JPEG or PNG, or retry.");
        return;
      }

      setSlotState(slotId, { status: "uploading", preview: localPreview });
      resetIdleTimer();

      const form = new FormData();
      if (uploadToken?.trim()) form.append("token", uploadToken.trim());
      form.append("itemId", mondayItemId.trim());
      form.append("angleId", slotId);
      form.append("procedure", PROCEDURE);
      form.append("file", file, file.name);

      try {
        const res = await fetch("/api/monday/upload-angle-photo", {
          method: "POST",
          body: form,
          credentials: "same-origin",
        });
        const raw = await res.text();
        const data = parseUploadAnglePhotoBody(raw);

        if (isUploadAnglePhotoSuccess(res.status, data)) {
          setSlotState(slotId, {
            status: "done",
            preview: localPreview,
            assetId: data.assetId,
          });
          return;
        }

        const msg = userMessageFromUploadAnglePhotoFailure(res.status, data);
        revokeIfObjectUrl(localPreview);
        setSlotState(slotId, { status: "error", message: msg });
        toast.error(msg);
      } catch (e) {
        const msg =
          e instanceof Error && e.message
            ? e.message
            : "Couldn’t reach the server. Check your connection and try again.";
        revokeIfObjectUrl(localPreview);
        setSlotState(slotId, { status: "error", message: msg });
        toast.error(msg);
      }
    },
    [mondayItemId, resetIdleTimer, revokeIfObjectUrl, setSlotState, uploadToken],
  );

  const onInputChange = useCallback(
    (slotId: HairImageSlotId) => (e: ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      e.target.value = "";
      if (file) void runUpload(slotId, file);
    },
    [runUpload],
  );

  const onDropOnCard = useCallback(
    (slotId: HairImageSlotId) => (e: DragEvent) => {
      e.preventDefault();
      const file = e.dataTransfer.files?.[0];
      if (file) void runUpload(slotId, file);
    },
    [runUpload],
  );

  const openPicker = useCallback((slotId: HairImageSlotId) => {
    inputRefs.current[slotId]?.click();
  }, []);

  const firstIncompleteId = useCallback(() => {
    return (
      HAIR_IMAGE_SLOTS.find((s) => uploads[s.id].status !== "done")?.id ??
      HAIR_IMAGE_SLOTS[0].id
    );
  }, [uploads]);

  const onIntroGetStarted = useCallback(() => {
    setActiveSlotId(firstIncompleteId());
    setStep(2);
  }, [firstIncompleteId]);

  const onStepUploadFile = useCallback(
    (file: File) => {
      void runUpload(activeSlotId, file);
    },
    [activeSlotId, runUpload],
  );

  const onStep2FooterBack = useCallback(() => {
    setStep(1);
  }, []);

  const onStep3FooterBack = useCallback(() => {
    setStep(2);
  }, []);

  const onStep3Submit = useCallback(async () => {
    setSubmitReviewLoading(true);
    try {
      try {
        const res = await fetch("/api/quiz/photo-upload-review-complete", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(uploadToken?.trim() ? { token: uploadToken.trim() } : {}),
        });
        if (!res.ok) {
          const t = await res.text().catch(() => "");
          console.warn("[HairImageUpload] photo-upload-review-complete:", res.status, t);
        }
      } catch (e) {
        console.warn("[HairImageUpload] photo-upload-review-complete", e);
      }
      router.push(funnelStepHref("/dashboard-muted"));
    } finally {
      setSubmitReviewLoading(false);
    }
  }, [router, uploadToken]);

  const onReuploadFromReview = useCallback(
    (slotId: HairImageSlotId, file: File) => {
      void runUpload(slotId, file);
    },
    [runUpload],
  );

  const allDone = doneCount >= HAIR_IMAGE_SLOTS.length;

  const onStep2Continue = useCallback(() => {
    if (allDone) {
      setStep(3);
      return;
    }
    if (uploads[activeSlotId].status !== "done") {
      toast.error("Upload an image for this pose first.");
      return;
    }
    const next = HAIR_IMAGE_SLOTS.find((s) => uploads[s.id].status !== "done");
    if (!next) {
      setStep(3);
      return;
    }
    setActiveSlotId(next.id);
  }, [activeSlotId, allDone, uploads]);

  const continueDisabled =
    loadingAnglePhotos || (!allDone && uploads[activeSlotId].status !== "done");

  return (
    <div className={shell.page}>
      <header className={shell.header}>
        <Link href="/" className={shell.logo}>AestheticMatch Hair</Link>
      </header>

      <main
        className={
          step === 2 || step === 3 ? `${shell.main} ${shell.mainStep2}`.trim() : shell.main
        }
      >
        {step === 1 ? (
          <HairImageUploadStepIntro
            uploads={uploads}
            inputRefs={inputRefs}
            onOpenPicker={openPicker}
            onInputChange={onInputChange}
            onDrop={onDropOnCard}
          />
        ) : step === 2 ? (
          <HairImageUploadStepUpload
            activeSlotId={activeSlotId}
            onSelectSlot={setActiveSlotId}
            uploads={uploads}
            onFileSelected={onStepUploadFile}
            onBackToIntro={() => setStep(1)}
            loadingPhotos={loadingAnglePhotos}
          />
        ) : (
          <HairImageUploadStepReview
            uploads={uploads}
            onBack={() => setStep(2)}
            onReuploadFile={onReuploadFromReview}
            loadingPhotos={loadingAnglePhotos}
          />
        )}
      </main>

      <footer className={shell.footer}>
        {step === 1 ? (
          <>
            <div className={shell.footerMetaIntro}>
              <p className={shell.footerNextLabel}>Your next step</p>
              <p className={shell.footerNextTitle}>{nextStepTitle}</p>
            </div>
            <div className={shell.footerActions}>
              <div className={shell.footerBtnRow}>
                <button
                  type="button"
                  onClick={onIntroGetStarted}
                  className={shell.btnPrimary}
                >
                  <span className={shell.btnPrimaryLabel}>Get Started →</span>
                </button>
              </div>
            </div>
          </>
        ) : step === 2 ? (
          <>
            <div className={shell.footerMetaUpload}>
              <p className={shell.footerMuted}>Image uploaded</p>
              <p className={shell.footerEmphasis}>
                {doneCount} / {HAIR_IMAGE_SLOTS.length}
              </p>
            </div>
            <div className={shell.footerActions}>
              <div className={shell.footerBtnRow}>
                <button
                  type="button"
                  onClick={onStep2FooterBack}
                  className={shell.btnSecondary}
                >
                  <span className={shell.btnSecondaryLabel}>Back</span>
                </button>
                <button
                  type="button"
                  onClick={onStep2Continue}
                  className={shell.btnPrimary}
                  disabled={continueDisabled}
                >
                  <span className={shell.btnPrimaryLabel}>Continue →</span>
                </button>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className={shell.footerMetaUpload}>
              <p className={`${shell.footerMuted} ${shell.visibleDesktopOnly}`}>All photos uploaded</p>
              <p className={`${shell.footerMuted} ${shell.visibleMobileOnly}`}>Image uploaded</p>
              <p className={shell.footerEmphasis}>
                {doneCount} / {HAIR_IMAGE_SLOTS.length}
              </p>
            </div>
            <div className={shell.footerActions}>
              <div className={shell.footerBtnRow}>
                <button type="button" onClick={onStep3FooterBack} className={shell.btnSecondary}>
                  <span className={shell.btnSecondaryLabel}>Back</span>
                </button>
                <button
                  type="button"
                  onClick={() => void onStep3Submit()}
                  className={shell.btnPrimary}
                  disabled={!allDone || submitReviewLoading || loadingAnglePhotos}
                >
                  <span className={shell.btnPrimaryLabel}>Submit Images →</span>
                </button>
              </div>
            </div>
          </>
        )}
      </footer>
    </div>
  );
}
