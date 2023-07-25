import React from "react";
import {
  RxCalendar,
  RxClock,
  RxEnvelopeClosed,
  RxFilePlus,
  RxFrame,
  RxGroup,
  RxLink2,
  RxMinus,
  RxMove,
  RxText,
} from "react-icons/rx";

const defaultIcons = {
  date: <RxCalendar />,
  datetime: <RxClock />,
  daterange: <RxCalendar />,
  text: <RxText />,
  integer: <RxFrame />,
  float: <RxFrame />,
  email: <RxEnvelopeClosed />,
  file: <RxFilePlus />,
  pagebreak: <RxMinus />,
  url: <RxLink2 />,
  group: <RxGroup />,
  dragndrop: <RxMove />,
};

export default defaultIcons;
