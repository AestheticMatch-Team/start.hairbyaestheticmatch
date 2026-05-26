"use client";

import Image from "next/image";
import { useCallback, useRef, type ChangeEvent } from "react";
import { isHairAngleImagePick } from "./hair-angle-preview-url";
import {
  HAIR_IMAGE_SLOTS,
  type HairImageSlotId,
  type SlotUploadState,
} from "./hair-image-upload-shared";
import { getHairSlotPreviewUrl, hairSlotReviewCaption } from "./hair-image-upload-helpers";
import {
  imgChevronLeftStep3,
  imgExportStep3,
  imgProfileStep3,
  imgSecurityStep3,
  imgTickCircleBoldStep3,
} from "./hair-image-upload-assets";
import styles from "./HairImageUploadStepReview.module.scss";

type Props = {
  uploads: Record<HairImageSlotId, SlotUploadState>;
  onBack: () => void;
  onReuploadFile: (slotId: HairImageSlotId, file: File) => void;
  loadingPhotos?: boolean;
};

export default function HairImageUploadStepReview({
  uploads,
  onBack,
  onReuploadFile,
  loadingPhotos = false,
}: Props) {
  const fileRef = useRef<HTMLInputElement>(null);
  const pendingSlotRef = useRef<HairImageSlotId | null>(null);

  const openReupload = useCallback((slotId: HairImageSlotId) => {
    pendingSlotRef.current = slotId;
    fileRef.current?.click();
  }, []);

  const onFileChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      const slotId = pendingSlotRef.current;
      e.target.value = "";
      pendingSlotRef.current = null;
      if (file && isHairAngleImagePick(file) && slotId) {
        onReuploadFile(slotId, file);
      }
    },
    [onReuploadFile],
  );

  return (
    <div className={styles.root}>
      <input
        ref={fileRef}
        type="file"
        accept="image/*,.heic,.dng"
        className={styles.visuallyHidden}
        aria-label="Choose image to re-upload"
        onChange={onFileChange}
      />

      <button type="button" className={styles.backLink} onClick={onBack}>
        <Image alt="" src={imgChevronLeftStep3} width={16} height={16} unoptimized className={styles.chevron} />
        <span className={styles.backLabel}>Back</span>
      </button>

      <div className={styles.split}>
        <div className={styles.left}>
          <div className={styles.heroBlock}>
            <h1 className={styles.heroTitle}>
              <span className={styles.heroPlain}>Final </span>
              <span className={styles.heroAccent}>Review</span>
            </h1>
            <div className={styles.heroMobileSecurity}>
              <p className={styles.heroMobileSecureTitle}>Your photos are secure.</p>
              <p className={styles.heroMobileSecureBody}>
                End-to-end encrypted and never used publicly. You can re-upload any photo before submitting.
              </p>
            </div>
            <div className={styles.subBlock}>
              <p className={styles.subLead}>You&apos;re almost done.</p>
              <p className={styles.subMuted}>
                Review the following photos before submission. Once you submit, our specialists will begin your hair
                analysis.
              </p>
            </div>
          </div>

          <div className={styles.securityStrip}>
            <div className={styles.securityIconWrap}>
              <Image alt="" src={imgSecurityStep3} width={16} height={16} unoptimized className={styles.securityIcon} />
            </div>
            <div className={styles.securityCopy}>
              <p className={styles.securityTitle}>Your photos are secure.</p>
              <p className={styles.securityBody}>
                End-to-end encrypted and never used publicly. You can re-upload any photo before submitting.
              </p>
            </div>
          </div>
        </div>

        <div className={styles.divider} aria-hidden />

        <div className={styles.right}>
          <p className={styles.listLabel}>Your Uploaded Photos</p>
          {loadingPhotos ? (
            <div className={styles.reviewLoading}>
              <span className={styles.spinner} aria-hidden />
              <p className={styles.reviewLoadingText}>Loading your photos…</p>
            </div>
          ) : (
            <ul className={styles.list}>
              {HAIR_IMAGE_SLOTS.map((pose) => {
                const st = uploads[pose.id];
                const done = st.status === "done";
                const uploading = st.status === "uploading";
                const preview = getHairSlotPreviewUrl(st);
                const err = st.status === "error";

                return (
                  <li key={pose.id} className={styles.row}>
                    <div className={styles.rowTop}>
                      <div className={styles.thumbWrap}>
                        {preview ? (
                          <img
                            src={preview}
                            alt=""
                            className={styles.thumbPhoto}
                            draggable={false}
                          />
                        ) : (
                          <Image
                            alt=""
                            src={imgProfileStep3}
                            width={24}
                            height={24}
                            unoptimized
                            className={styles.thumbIcon}
                          />
                        )}
                        {uploading ? (
                          <div className={styles.thumbLoading}>
                            <span className={styles.spinner} aria-hidden />
                          </div>
                        ) : null}
                      </div>
                      <div className={styles.rowText}>
                        <p className={styles.rowTitle}>{pose.title}</p>
                        <p className={styles.rowCaption}>{hairSlotReviewCaption(pose)}</p>
                        {err ? (
                          <p className={styles.rowError} role="alert">
                            {st.message}
                          </p>
                        ) : null}
                      </div>
                    </div>
                    <hr className={styles.rowRule} aria-hidden="true" />
                    <div className={styles.rowActions}>
                      {done && !uploading ? (
                        <Image
                          alt=""
                          src={imgTickCircleBoldStep3}
                          width={24}
                          height={24}
                          unoptimized
                          className={styles.tick}
                        />
                      ) : null}
                      <button
                        type="button"
                        className={styles.reuploadBtn}
                        onClick={() => openReupload(pose.id)}
                        disabled={uploading}
                        aria-label={`Re-upload ${pose.title}`}
                      >
                        <Image
                          alt=""
                          src={imgExportStep3}
                          width={14}
                          height={14}
                          unoptimized
                          className={styles.reuploadIcon}
                        />
                        <span className={styles.reuploadLabel}>Re-Upload</span>
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
