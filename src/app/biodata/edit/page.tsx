import { redirect } from "next/navigation";

export default function BiodataEditRedirectPage() {
  redirect("/biodata/create");
}
