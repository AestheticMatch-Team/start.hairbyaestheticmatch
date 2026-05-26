"use client";

import Image from "next/image";
import {
  type ChangeEvent,
  type DragEvent,
  type MutableRefObject,
} from "react";
import {
  HAIR_IMAGE_SLOTS,
  INTRO_TIPS,
  type HairImageSlotId,
  type SlotUploadState,
} from "./hair-image-upload-shared";
import {
  imgCheckStep1,
  imgDotStep1,
  imgLockStep1,
  imgProfileStep1,
} from "./hair-image-upload-assets";
import styles from "./HairImageUploadStepIntro.module.scss";

type Props = {
  uploads: Record<HairImageSlotId, SlotUploadState>;
  inputRefs: MutableRefObject<Record<HairImageSlotId, HTMLInputElement | null>>;
  onOpenPicker: (id: HairImageSlotId) => void;
  onInputChange: (id: HairImageSlotId) => (e: ChangeEvent<HTMLInputElement>) => void;
  onDrop: (id: HairImageSlotId) => (e: DragEvent) => void;
};

function ProfileGlyph() {
  return (
    <div className={styles.profileWrap}>
      <Image
        alt=""
        src={imgProfileStep1}
        width={24}
        height={24}
        className={styles.profileImg}
        unoptimized
      />
    </div>
  );
}

function LockGlyph() {
  return (
    <div className={styles.lockOuter} aria-hidden>
      <div className={styles.lockInset}>
        <div className={styles.lockImgPad}>
          <Image
            alt=""
            src={imgLockStep1}
            width={16}
            height={16}
            unoptimized
            className={styles.lockImg}
          />
        </div>
      </div>
    </div>
  );
}

export default function HairImageUploadStepIntro({
  uploads,
  inputRefs,
  onOpenPicker,
  onInputChange,
  onDrop,
}: Props) {
  const topRow = HAIR_IMAGE_SLOTS.slice(0, 4);
  const donor = HAIR_IMAGE_SLOTS[4];

  const renderCard = (slot: (typeof HAIR_IMAGE_SLOTS)[number], cardClassName?: string) => {
    const st = uploads[slot.id];
    const preview =
      st.status === "done" || st.status === "uploading" ? st.preview : null;
    const isDonor = slot.variant === "donor";

    const classNames = [
      cardClassName,
      preview ? styles.cardHasPreview : "",
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <div key={slot.id} className={classNames}>
        {preview ? (
          <div className={styles.previewLayer}>
            <Image
              src={preview}
              alt={`Preview ${slot.title}`}
              fill
              className={styles.previewImage}
              unoptimized
            />
            <div className={styles.previewGradient} aria-hidden />
          </div>
        ) : null}
        <div className={styles.cardBody}>
          <input
            ref={(el) => {
              inputRefs.current[slot.id] = el;
            }}
            type="file"
            accept="image/*"
            className={styles.visuallyHidden}
            aria-label={`Upload photo: ${slot.title}`}
            onChange={onInputChange(slot.id)}
          />
          <button
            type="button"
            className={styles.cardTrigger}
            onClick={() => onOpenPicker(slot.id)}
            onDragOver={(e) => e.preventDefault()}
            onDrop={onDrop(slot.id)}
          >
            <div className={styles.iconWrap}>
              <ProfileGlyph />
            </div>
            <div className={styles.cardCopy}>
              <div className={styles.cardCopyInner}>
                <p
                  className={`${styles.cardTitle} ${isDonor ? styles.cardTitleDonor : ""}`.trim()}
                >
                  {slot.title}
                </p>
                {isDonor ? (
                  <p className={`${styles.cardDesc} ${styles.cardDescDonor}`}>
                    {slot.introDescription}
                  </p>
                ) : (
                  <div className={styles.cardDesc}>{slot.introDescription}</div>
                )}
              </div>
              <div className={styles.requiredRow}>
                <div className={styles.dotWrap}>
                  <Image
                    alt=""
                    src={imgDotStep1}
                    width={8}
                    height={8}
                    unoptimized
                    className={styles.dotImg}
                  />
                </div>
                <p className={styles.requiredLabel}>Required</p>
              </div>
            </div>
          </button>
          {st.status === "error" ? (
            <p className={styles.errorText}>{st.message}</p>
          ) : null}
        </div>
      </div>
    );
  };

  return (
    <div className={styles.inner}>
      <div className={styles.hero}>
        <p className={styles.kicker}>Hair assessment — Photo upload</p>
        <div className={styles.heroStack}>
          <div className={styles.heroTitleWrap}>
            <p className={styles.heroTitle}>
              <span className={styles.heroTitlePlain}>Upload </span>
              <span className={styles.heroTitleAccent}>Your Photos</span>
            </p>
          </div>
          <p className={styles.intro}>
            Clear, well-lit photos help our specialists deliver the most accurate diagnosis
            <br aria-hidden="true" />
            and treatment plan. We&apos;ll guide you through each angle.
          </p>
        </div>
      </div>

      <div className={styles.contentCol}>
        <div className={styles.encryptBanner}>
          <div className={styles.lockFrame}>
            <LockGlyph />
          </div>
          <p className={styles.encryptText}>
            End-to-end encrypted · Never used publicly
          </p>
        </div>

        <div className={styles.countRow}>
          <p className={styles.countLabel}>
            Images uploaded ·{" "}
            {HAIR_IMAGE_SLOTS.filter((s) => uploads[s.id].status === "done").length}{" "}
            / 5
          </p>
        </div>

        <div className={styles.uploadBlock}>
          <div className={styles.cardsStack}>
            <div className={styles.grid}>
              {topRow.map((slot) => renderCard(slot, styles.card))}
            </div>

            <div className={styles.donorRow}>
              {renderCard(donor, `${styles.card} ${styles.cardDonor}`.trim())}
            </div>
          </div>

          <div className={styles.tips}>
            <div className={styles.tipsInner}>
              <p className={styles.tipsHeading}>Tips for best results</p>
              <div className={styles.tipsList}>
                {INTRO_TIPS.map((line) => (
                  <div key={line} className={styles.tipRow}>
                    <div className={styles.tipIcon}>
                      <Image
                        alt=""
                        src={imgCheckStep1}
                        width={16}
                        height={16}
                        unoptimized
                        className={styles.tipCheck}
                      />
                    </div>
                    <p className={styles.tipText}>{line}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
