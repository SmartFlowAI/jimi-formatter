import DefaultStyle from "./default.css?raw";
import WeeklyStyle from "./weekly.css?raw";

const wrap_style = (style: string) => {
  return `\n${style}\n`;
};

export default {
  "default": wrap_style(DefaultStyle),
  "weekly": wrap_style(WeeklyStyle),
} as { [key: string]: string };
