import { Filter } from 'bad-words';

export const filterProfanity = (req, res, next) => {
  const filter = new Filter();
  
  if (req.body.text) {
    // Store original text and filtered version
    req.body.filteredText = filter.clean(req.body.text);
    req.body.originalText = req.body.text;
    req.body.text = req.body.filteredText; // Use filtered version as main text
  }
  
  next();
};