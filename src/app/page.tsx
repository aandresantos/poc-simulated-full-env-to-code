import { Button } from "@heroui/button";
import { Link } from "@heroui/link";

export default function Home() {
  return (
    <section className="h-[100dvh] flex flex-col items-center justify-center ">
      <div className="flex items-center justify-center">
        <Link href="/code-env">
         <Button>Ir para ambiente</Button>
        </Link>
      </div>
    </section>
  );
}
