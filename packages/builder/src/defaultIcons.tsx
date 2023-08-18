import React from "react";
import {
  CalendarDays,
  CalendarRange,
  CalendarClock,
  Mail,
  SplitSquareVertical,
  TextCursor,
  FileDigit,
  Hash,
  FileUp,
  Link,
  Group,
} from "lucide-react";

const defaultIcons = {
  date: <CalendarDays />,
  datetime: <CalendarClock />,
  daterange: <CalendarRange />,
  text: <TextCursor />,
  integer: <FileDigit />,
  float: <Hash />,
  email: <Mail />,
  file: <FileUp />,
  pagebreak: <SplitSquareVertical />,
  url: <Link />,
  group: <Group />,
};

export default defaultIcons;
