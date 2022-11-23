"use client";

type Props = { error: Error };
export default function RootError({ error }: Props) {
  return (
    <>
      <h1 className="text-xl mb-4">Sorry, an error occurred!</h1>
      <p className="mb-4">Please reach us on GitHub, thank you!</p>
      <code className="mockup-code">{error.message}</code>
    </>
  );
}
