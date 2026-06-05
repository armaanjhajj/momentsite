import { redirect } from "next/navigation";

// The About content now lives on the home page (collective statement + the
// knowledge graph). Keep this route working by sending visitors there.
export default function About() {
  redirect("/#about");
}
