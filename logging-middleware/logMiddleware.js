import axios from "axios";

const log = async (stack, level, pkg, message) => {
  try {
    await axios.post("http://20.244.56.144/evaluation-service/logs", {
      stack,
      level,
      package: pkg,
      message,
    });
  } catch (err) {
    console.error("Logging failed", err.message);
  }
};

export default { log };



