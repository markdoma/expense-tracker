import ExpenseTracker from "./expense";
import Link from "next/link";

export default function Home() {
  return (
    <div>
      <nav>
        <ul>
          <li>
            <Link href="/expense">Expense Tracker</Link>
          </li>
          <li>
            <Link href="/parameters">Parameters</Link>
          </li>
        </ul>
      </nav>

      <ExpenseTracker />
    </div>
  );
}
