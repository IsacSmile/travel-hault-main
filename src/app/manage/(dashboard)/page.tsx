import React from 'react';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { Package, MapPin, Inbox, Users, Plus, ArrowRight, Clock, CheckCircle2, AlertCircle } from 'lucide-react';

interface RecentEnquiryItem {
  id: string;
  name: string;
  phone: string;
  email: string;
  type: string;
  status: string;
  createdAt: Date | string;
  package?: { title: string } | null;
  destinationsOfInterest?: string | null;
}

export const revalidate = 0;

export default async function AdminDashboardOverview() {
  const now = new Date();
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  const packagesCountPromise = prisma.package.count();
  const destinationsCountPromise = prisma.destination.count();
  const newEnquiriesCountPromise = prisma.enquiry.count({
    where: {
      createdAt: { gte: sevenDaysAgo },
    },
  });
  const totalSubscribersPromise = prisma.subscriber.count();
  const recentEnquiriesPromise = prisma.enquiry.findMany({
    take: 5,
    orderBy: { createdAt: 'desc' },
    include: { package: true },
  });

  const [packagesCount, destinationsCount, newEnquiriesCount, totalSubscribers, recentEnquiries] =
    await Promise.all([
      packagesCountPromise,
      destinationsCountPromise,
      newEnquiriesCountPromise,
      totalSubscribersPromise,
      recentEnquiriesPromise,
    ]);

  const stats = [
    {
      title: 'Total Trip Packages',
      value: packagesCount,
      icon: Package,
      color: 'bg-amber-50 text-amber-700 border-amber-200',
      href: '/manage/packages',
    },
    {
      title: 'Destinations Offered',
      value: destinationsCount,
      icon: MapPin,
      color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      href: '/manage/destinations',
    },
    {
      title: 'New Enquiries (7 Days)',
      value: newEnquiriesCount,
      icon: Inbox,
      color: 'bg-blue-50 text-blue-700 border-blue-200',
      href: '/manage/enquiries',
    },
    {
      title: 'Newsletter Subscribers',
      value: totalSubscribers,
      icon: Users,
      color: 'bg-purple-50 text-purple-700 border-purple-200',
      href: '/manage/subscribers',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white text-[#051b2e] p-6 rounded-3xl border border-gray-200 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold font-serif">Welcome back, Admin</h1>
          <p className="text-sm text-gray-600 mt-1">
            Manage packages, review customer enquiries, and update website content in real time.
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <Link
            href="/manage/packages/form"
            className="px-4 py-2.5 bg-[#051b2e] hover:bg-[#0a253e] text-[#c9a15a] font-bold rounded-xl text-sm transition flex items-center gap-2 shadow"
          >
            <Plus className="w-4 h-4" /> Add Package
          </Link>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link
              key={stat.title}
              href={stat.href}
              className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition group"
            >
              <div className="flex items-center justify-between">
                <div className={`p-3 rounded-xl border ${stat.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-[#b8934b] group-hover:translate-x-1 transition" />
              </div>
              <div className="mt-4">
                <p className="text-2xl font-bold text-[#051b2e]">{stat.value}</p>
                <p className="text-xs font-semibold text-gray-500 mt-1">{stat.title}</p>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Recent Enquiries Table */}
      <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-[#051b2e]">Recent Customer Enquiries</h2>
            <p className="text-xs text-gray-500">Latest trip bookings and custom itinerary requests.</p>
          </div>
          <Link
            href="/manage/enquiries"
            className="text-xs font-bold text-[#b8934b] hover:underline flex items-center gap-1"
          >
            View All Inbox <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {recentEnquiries.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            <Inbox className="w-12 h-12 mx-auto text-gray-300 mb-3" />
            <p className="text-sm font-medium">No customer enquiries submitted yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-600">
              <thead className="bg-[#F5F0E6] text-xs font-bold uppercase text-gray-500 tracking-wider">
                <tr>
                  <th className="px-6 py-3.5">Customer</th>
                  <th className="px-6 py-3.5">Type</th>
                  <th className="px-6 py-3.5">Trip Details</th>
                  <th className="px-6 py-3.5">Status</th>
                  <th className="px-6 py-3.5">Date</th>
                  <th className="px-6 py-3.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {(recentEnquiries as RecentEnquiryItem[]).map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50/50 transition">
                    <td className="px-6 py-4 font-medium text-gray-900">
                      <div className="font-bold">{item.name}</div>
                      <div className="text-xs text-gray-400">{item.phone} • {item.email}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-800">
                        {item.type}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {item.package ? (
                        <div className="font-bold text-[#051b2e]">{item.package.title}</div>
                      ) : item.destinationsOfInterest ? (
                        <div>{item.destinationsOfInterest}</div>
                      ) : (
                        <div className="text-gray-400">General Enquiry</div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${item.status === 'New'
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : item.status === 'Contacted'
                            ? 'bg-blue-50 text-blue-700 border border-blue-200'
                            : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          }`}
                      >
                        {item.status === 'New' && <AlertCircle className="w-3 h-3 text-amber-600" />}
                        {item.status === 'Contacted' && <Clock className="w-3 h-3 text-blue-600" />}
                        {item.status === 'Closed' && <CheckCircle2 className="w-3 h-3 text-emerald-600" />}
                        {item.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs text-gray-500">
                      {new Date(item.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        href={`/manage/enquiries?id=${item.id}`}
                        className="text-xs font-bold text-[#051b2e] hover:text-[#b8934b] underline"
                      >
                        View Details
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
