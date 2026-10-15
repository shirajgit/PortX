"use client";
import { useSyncExternalStore } from "react";
import { CURRENCY_COOKIE, isCurrency, type Currency } from "./pricing";

/* The middleware sets the currency cookie from the visitor's country. The server
   render (and any static page) uses INR; the browser switches on hydration. */
function read(): Currency {
  const m = document.cookie.match(new RegExp(`(?:^|; )${CURRENCY_COOKIE}=([^;]*)`));
  return m && isCurrency(m[1]) ? m[1] : "INR";
}
const subscribe = () => () => {};

export function useCurrency(): Currency {
  return useSyncExternalStore(subscribe, read, () => "INR");
}
