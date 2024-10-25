export const validateRequest = ({ res, custom, ...message }, ...name) => {
  name.forEach((element) => {
    if (!element) {
      if (custom) {
        res.status(400).json({ message });
      } else {
        res.status(400).json({ message: `${element} is required` });
      }
    }
  });
};
