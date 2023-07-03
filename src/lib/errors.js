export function parseErrorMessage(err, defaultMessage = "") {
  if (typeof err === "string") return err;
  else if (typeof err === "object" && err.message) return err.message;
  else return defaultMessage;
}
