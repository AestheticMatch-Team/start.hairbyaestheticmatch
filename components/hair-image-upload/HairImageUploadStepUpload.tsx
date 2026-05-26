"use client";

import Image from "next/image";
import { useCallback, useRef, type ChangeEvent, type DragEvent, type ReactNode } from "react";
import { isHairAngleImagePick } from "./hair-angle-preview-url";
import {
  HAIR_IMAGE_SLOTS,
  type HairImageSlotId,
  type SlotUploadState,
} from "./hair-image-upload-shared";
import { getHairSlotPreviewUrl } from "./hair-image-upload-helpers";
import {
  imgCheckSmallStep2,
  imgChevronLeftStep2,
  imgCloseStep2,
  imgExportStep2,
  imgInfoCircleStep2,
} from "./hair-image-upload-assets";
import styles from "./HairImageUploadStepUpload.module.scss";

const CHECKLIST_POSITIVE = [
  "Dry hair only — no product",
  "Even, natural lighting",
  "Plain, uncluttered background",
  "Hair down, unstyled naturally",
  "Camera at the correct angle for the pose",
] as const;

const CHECKLIST_NEGATIVE = [
  "No filters or editing",
  "No blurry or cropped images",
  "No harsh flash or backlighting",
] as const;

type Props = {
  activeSlotId: HairImageSlotId;
  onSelectSlot: (id: HairImageSlotId) => void;
  uploads: Record<HairImageSlotId, SlotUploadState>;
  onFileSelected: (file: File) => void;
  onBackToIntro: () => void;
  loadingPhotos?: boolean;
};

function PoseGridButton({
  title,
  uploadState,
  isActive,
  cellClass,
  onSelect,
}: {
  title: ReactNode;
  uploadState: SlotUploadState;
  isActive: boolean;
  cellClass: string;
  onSelect: () => void;
}) {
  const preview = getHairSlotPreviewUrl(uploadState);
  const done = uploadState.status === "done";

  return (
    <button
      type="button"
      className={`${cellClass} ${isActive ? styles.poseCellSelected : ""} ${
        preview ? styles.poseCellHasPreview : ""
      } ${done ? styles.poseCellDone : ""}`.trim()}
      onClick={onSelect}
    >
      {preview ? (
        <img src={preview} alt="" className={styles.poseThumbPreview} draggable={false} />
      ) : null}
      <span className={styles.poseCellLabel}>{title}</span>
      {done ? (
        <span className={styles.poseDoneMark} aria-hidden>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
            <path d="M20 6L9 17l-5-5" />
          </svg>
        </span>
      ) : null}
    </button>
  );
}

export default function HairImageUploadStepUpload({
  activeSlotId,
  onSelectSlot,
  uploads,
  onFileSelected,
  onBackToIntro,
  loadingPhotos = false,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const activeSlot =
    HAIR_IMAGE_SLOTS.find((s) => s.id === activeSlotId) ?? HAIR_IMAGE_SLOTS[0];
  const st = uploads[activeSlotId];

  const openFile = useCallback(() => inputRef.current?.click(), []);

  const onChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      e.target.value = "";
      if (file) onFileSelected(file);
    },
    [onFileSelected],
  );

  const onDrop = useCallback(
    (e: DragEvent) => {
      e.preventDefault();
      if (st.status === "uploading" || loadingPhotos) return;
      const file = e.dataTransfer.files?.[0];
      if (file && isHairAngleImagePick(file)) onFileSelected(file);
    },
    [loadingPhotos, onFileSelected, st.status],
  );

  const previewUrl = getHairSlotPreviewUrl(st);
  const isUploading = st.status === "uploading";
  const isError = st.status === "error";
  const hasPreview = Boolean(previewUrl);

  const activateDropzone = !loadingPhotos && !isUploading;

  return (
    <div className={styles.root}>
      <div className={styles.split}>
        <div className={styles.left}>
          <button type="button" className={styles.backLink} onClick={onBackToIntro}>
            <Image
              alt=""
              src={imgChevronLeftStep2}
              width={16}
              height={16}
              unoptimized
              className={styles.chevron}
            />
            <span className={styles.backLabel}>Back</span>
          </button>

          <div className={styles.introBlock}>
            <h1 className={styles.heroTitle}>
              <span className={styles.heroPlain}>Upload </span>
              <span className={styles.heroAccent}>Your </span>
              <span className={styles.heroAccent}>Photos</span>
            </h1>
            <p className={styles.blurb}>
              You&apos;re almost done. Once we have your images, our specialists can begin your hair
              analysis.
            </p>
          </div>

          <div className={styles.leftLower}>
            <div className={styles.posesSection}>
              <p className={styles.posesLabel}>Poses required</p>
              <div className={styles.poseGrid}>
                <div className={styles.poseRow}>
                  {HAIR_IMAGE_SLOTS.slice(0, 4).map((slot) => (
                    <PoseGridButton
                      key={slot.id}
                      title={slot.title}
                      uploadState={uploads[slot.id]}
                      isActive={activeSlotId === slot.id}
                      cellClass={styles.poseCell}
                      onSelect={() => onSelectSlot(slot.id)}
                    />
                  ))}
                </div>
                <PoseGridButton
                  title={
                    <>
                      Donor
                      <br aria-hidden="true" />
                      Area
                    </>
                  }
                  uploadState={uploads.hair_donor}
                  isActive={activeSlotId === "hair_donor"}
                  cellClass={styles.donorCell}
                  onSelect={() => onSelectSlot("hair_donor")}
                />
              </div>
            </div>

            <div className={styles.checklist}>
              <div className={styles.checklistHead}>
                <Image
                  alt=""
                  src={imgInfoCircleStep2}
                  width={18}
                  height={18}
                  unoptimized
                  className={styles.infoIcon}
                />
                <p className={styles.checklistTitle}>Pre-Consultation Checklist</p>
              </div>
              <div className={styles.checklistList}>
                {CHECKLIST_POSITIVE.map((line) => (
                  <div key={line} className={styles.checkRow}>
                    <div className={styles.badge}>
                      <Image
                        alt=""
                        src={imgCheckSmallStep2}
                        width={12}
                        height={12}
                        unoptimized
                        className={styles.checkIcon}
                      />
                    </div>
                    <p className={styles.rowText}>{line}</p>
                  </div>
                ))}
                {CHECKLIST_NEGATIVE.map((line) => (
                  <div key={line} className={styles.checkRow}>
                    <div className={styles.badge}>
                      <Image
                        alt=""
                        src={imgCloseStep2}
                        width={12}
                        height={12}
                        unoptimized
                        className={styles.checkIcon}
                      />
                    </div>
                    <p className={styles.rowText}>{line}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className={styles.divider} aria-hidden />

        <div className={styles.right}>
          <div className={styles.uploadPanel}>
            <div className={styles.uploadHeader}>
              <p className={styles.uploadTitle}>{activeSlot.title}</p>
              <p className={styles.uploadSubtitle}>{activeSlot.uploadInstruction}</p>
            </div>

            {loadingPhotos ? (
              <div className={styles.photosLoading}>
                <span className={styles.spinner} aria-hidden />
                <p className={styles.photosLoadingText}>Loading your photos…</p>
              </div>
            ) : (
              <>
                <div
                  className={`${styles.dropzone} ${hasPreview ? styles.dropzoneFilled : ""}`.trim()}
                  role="button"
                  tabIndex={0}
                  onClick={() => activateDropzone && openFile()}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      if (activateDropzone) openFile();
                    }
                  }}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={onDrop}
                >
                  <input
                    ref={inputRef}
                    type="file"
                    accept="image/*,.heic,.dng"
                    className={styles.visuallyHidden}
                    aria-label={`Choose file for ${activeSlot.title}`}
                    onChange={onChange}
                  />
                  {hasPreview && previewUrl ? (
                    <>
                      <img
                        src={previewUrl}
                        alt={`${activeSlot.title} preview`}
                        className={styles.previewImage}
                        draggable={false}
                      />
                      <button
                        type="button"
                        className={styles.reuploadBtn}
                        onClick={(e) => {
                          e.stopPropagation();
                          openFile();
                        }}
                        disabled={isUploading}
                      >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                          <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                          <polyline points="17 8 12 3 7 8" />
                          <line x1="12" y1="3" x2="12" y2="15" />
                        </svg>
                        Replace
                      </button>
                    </>
                  ) : (
                    <>
                      <div className={styles.dropInner}>
                        <div className={styles.exportIconWrap}>
                          <Image
                            alt=""
                            src={imgExportStep2}
                            width={20}
                            height={20}
                            unoptimized
                            className={styles.exportIcon}
                          />
                        </div>
                        <p className={styles.formats}>JPG · PNG · DNG · HEIC</p>
                      </div>
                      <div className={styles.dragRow}>
                        <p className={styles.dragMuted}>Drag and drop or</p>
                        <button
                          type="button"
                          className={styles.linkFake}
                          onClick={(e) => {
                            e.stopPropagation();
                            openFile();
                          }}
                        >
                          Choose file upload
                        </button>
                      </div>
                    </>
                  )}
                  {isUploading ? (
                    <div className={styles.uploadOverlay}>
                      <span className={styles.spinner} aria-hidden />
                    </div>
                  ) : null}
                </div>

                {isError ? <p className={styles.errorBanner}>{st.message}</p> : null}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
