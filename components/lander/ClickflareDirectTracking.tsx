import Script from "next/script";
import {
  clickflareTrackingOrigin,
  shouldLoadClickflareDirectTracking,
} from "@/lib/funnel";

const DEFAULT_CLICKFLARE_CAMPAIGN_ID = "6a122a576fdcf70012dc7ab0";

function clickflareScript(): string {
  const trackingOrigin = clickflareTrackingOrigin();
  const fallbackContainerId =
    process.env.NEXT_PUBLIC_CLICKFLARE_CONTAINER_ID?.trim() || "__CONTAINER_ID__";
  const fallbackCampaignId =
    process.env.NEXT_PUBLIC_CLICKFLARE_CAMPAIGN_ID?.trim() || DEFAULT_CLICKFLARE_CAMPAIGN_ID;

  return `
(function(trackingOrigin, fallbackContainerId, fallbackCampaignId) {
  "use strict";

  var lpRefParam = "lp_ref";
  var campaignParam = "cpid";
  var lpUrlParam = "lpurl";
  var clickPathPattern = "(?<domain>http(?:s?)://[^/]*)".concat("/cf/click");
  var ctaPattern = "(?:(?:/(?<cta>[1-9][0-9]*)/?)|(?:/))?";
  var trackedHrefPattern = "^".concat(clickPathPattern).concat(ctaPattern).concat("(?:$|(\\\\?.*))");
  var rewrittenHrefPattern = 'javascript:window.clickflare.l="(?<original_link>'.concat(clickPathPattern).concat(ctaPattern, '("|(\\\\?[^"]*"))).*');

  function trackedHrefRegex() {
    return new RegExp(trackedHrefPattern, "");
  }

  function rewrittenHrefRegex() {
    return new RegExp(rewrittenHrefPattern, "");
  }

  function rewriteClickHref(href) {
    var normalizedHref = href.replace(trackedHrefRegex(), function(match) {
      var groups = arguments[arguments.length - 1];
      return match.replace(groups.domain, trackingOrigin);
    });

    return 'javascript:window.clickflare.l="'.concat(normalizedHref, '"; void 0;');
  }

  function replaceTrackedLinks(event, previousReadyStateHandler) {
    if (previousReadyStateHandler && event) {
      previousReadyStateHandler.apply(document, [event]);
    }

    if (!/loaded|interactive|complete/.test(document.readyState)) return;

    for (var i = 0; i < document.links.length; i++) {
      var link = document.links[i];
      if (!trackedHrefRegex().test(link.href)) continue;
      if (window.clickflare.links_replaced.has(link)) continue;

      link.href = rewriteClickHref(link.href);
      window.clickflare.links_replaced.add(link);
    }
  }

  function restoreOriginalHref(href) {
    var match = href.match(rewrittenHrefRegex());
    if (!match) return href;

    var originalLink = (match.groups || {}).original_link;
    return originalLink ? originalLink.slice(0, -1) : href;
  }

  function restoreLinksAfterScriptError() {
    for (var i = 0; i < document.links.length; i++) {
      var link = document.links[i];
      if (!rewrittenHrefRegex().test(decodeURI(link.href))) continue;

      setTimeout(function(target) {
        target.setAttribute("href", restoreOriginalHref(decodeURI(target.href)));
      }, 0, link);
    }
  }

  function campaignIdFromCookie() {
    var match = document.cookie.match(new RegExp("(^| )".concat("cf_cpid", "=([^;]+)")));
    return (match && match.pop()) || null;
  }

  function tagUrl(path, campaignId) {
    var url = new URL("".concat(trackingOrigin).concat(path));
    var isPlaceholder = campaignId.startsWith("{{") || campaignId.startsWith("__");

    if (!isPlaceholder) {
      url.searchParams.set(campaignParam, campaignId);
    }

    url.searchParams.append(lpRefParam, document.referrer);
    url.searchParams.append(lpUrlParam, location.href);
    url.searchParams.append("lpt", document.title);
    url.searchParams.append("t", new Date().getTime().toString());
    return url.toString();
  }

  function injectTag(path, campaignId) {
    var script = document.createElement("script");
    var firstScript = document.scripts[0];
    script.async = true;
    script.src = tagUrl(path, campaignId);
    script.onerror = restoreLinksAfterScriptError;
    firstScript.parentNode && firstScript.parentNode.insertBefore(script, firstScript);
  }

  var previousReadyStateHandler = document.onreadystatechange;

  window.clickflare = window.clickflare || {
    listeners: {},
    customParams: {},
    links_replaced: new Set(),
    addEventListener: function(name, listener) {
      var listeners = this.listeners[name] || [];
      if (!listeners.includes(listener)) listeners.push(listener);
      this.listeners[name] = listeners;
    },
    dispatchEvent: function(name, params) {
      if (params) this.customParams[name] = params;
      (this.listeners[name] || []).forEach(function(listener) {
        return listener(params);
      });
    },
    push: function(name, params) {
      if (params) this.customParams[name] = params;
      (this.listeners[name] || []).forEach(function(listener) {
        return listener(params);
      });
    },
  };

  document.onreadystatechange = function(event) {
    return replaceTrackedLinks(event, previousReadyStateHandler);
  };

  replaceTrackedLinks(null, previousReadyStateHandler);

  setTimeout(function() {
    var params = new URL(window.location.href).searchParams;
    var containerId = params.get("cftmid") || fallbackContainerId;
    var campaignId = params.get(campaignParam) || campaignIdFromCookie() || fallbackCampaignId;
    injectTag("/cf/tags/".concat(containerId), campaignId);
  }, 0);
})(${JSON.stringify(trackingOrigin)}, ${JSON.stringify(fallbackContainerId)}, ${JSON.stringify(fallbackCampaignId)});
`;
}

export default function ClickflareDirectTracking() {
  if (!shouldLoadClickflareDirectTracking()) return null;

  return (
    <Script
      id="clickflare-direct-tracking"
      strategy="afterInteractive"
      dangerouslySetInnerHTML={{ __html: clickflareScript() }}
    />
  );
}
