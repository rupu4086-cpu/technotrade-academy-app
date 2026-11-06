// Fresh app design - "Market Amber".
// Deliberately NOT the website's Astra navy/teal look: warm paper
// background, charcoal ink, amber accent, green for gains, red for falls.
export const theme = {
  colors: {
    paper: '#FAF6EF',
    card: '#FFFFFF',
    ink: '#1E1B16',
    muted: '#6B645A',
    line: '#E8DFD0',
    amber: '#E8A020',
    amberDark: '#B97E0B',
    green: '#1E7A4C',
    red: '#C0392B',
    charcoal: '#26221C',
  },
  radius: 16,
  spacing: 16,
};

export const inr = (paise: number) => `₹${Math.round(paise / 100).toLocaleString('en-IN')}`;
