import Image from 'next/image';
import EmployeeManagement from './employee/page';

export default function Home() {
  return (
    <main className="bg-white flex min-h-screen flex-col items-center justify-between p-6">
      <EmployeeManagement />
    </main>
  );
}
