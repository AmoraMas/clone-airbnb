/** @format */

import http from "k6/http";
import { check } from "k6";

export const options = {
  vus: 1000,
  duration: "30s",
};

export default function () {
  //let res = http.get("http://localhost:3000");
  let res = http.get("http://localhost:5172/properties/1/reviews");
  check(res, {
    "is status 200": (r) => r.status === 200,
  });
}
