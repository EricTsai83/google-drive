"use client";

import { useFormStatus } from "react-dom";
import { Button } from "./ui/button";

export function GetStartedButton() {
  const { pending } = useFormStatus();

  return (
    <Button className="w-full" size="lg" type="submit" disabled={pending}>
      {pending ? "Verifying..." : "Get Started"}
    </Button>
  );
}
