import { Header } from "@components";
import { useI18nContext } from "@/i18n/i18n-react";

export default function Help() {
  const { LL } = useI18nContext();

  return (
    <main className="bg-white h-screen">
      <Header />
      <div className="h-screen flex justify-center items-center">
        <h1>{LL.HELP_TITLE()}</h1>
      </div>
    </main>
  );
}
