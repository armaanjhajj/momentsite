// The two-tone LYFESTYL wordmark from the app icon: LYFE in blue, STYL in green.
export function LyfestylWordmark() {
  return (
    <span className="lyfestyl-wordmark">
      <span className="visually-hidden">LYFESTYL</span>
      <span className="lyfestyl-lyfe" aria-hidden="true">LYFE</span>
      <span className="lyfestyl-styl" aria-hidden="true">STYL</span>
    </span>
  );
}
