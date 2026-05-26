"use client";

import Script from "next/script";

/**
 * Loads GTM + Amplitude after interactive
 */
export default function AnalyticsLoader({
  gtmId,
  amplitudeKey,
}: {
  gtmId: string;
  amplitudeKey: string;
}) {
  return (
    <>
      <Script id="gtm-script" strategy="afterInteractive">
        {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${gtmId}');`}
      </Script>

      <Script
        id="amplitude-init"
        strategy="afterInteractive"
        src={`https://cdn.amplitude.com/script/${amplitudeKey}.js`}
      />
      <Script id="amplitude-config" strategy="afterInteractive">
        {`window.amplitude.add(window.sessionReplay.plugin({sampleRate:1}));window.amplitude.init('${amplitudeKey}',{fetchRemoteConfig:true,autocapture:{attribution:true,fileDownloads:true,formInteractions:true,pageViews:true,sessions:true,elementInteractions:true,networkTracking:true,webVitals:true,frustrationInteractions:true}});`}
      </Script>
    </>
  );
}
