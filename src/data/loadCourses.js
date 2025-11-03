import devCourses from "./courses.dev.json";
import testCourses from "./courses.test.json";
import prodCourses from "./courses.json";

const env = process.env.NEXT_PUBLIC_ENV || process.env.NODE_ENV || "production";

let coursesData;

switch (env) {
  case "development":
    coursesData = devCourses;
    break;
  case "test":
    coursesData = testCourses;
    break;
  default:
    coursesData = prodCourses;
}

export default coursesData;
