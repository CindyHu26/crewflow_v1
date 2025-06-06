'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { User, Leave } from '@/types';
import { calculateAnnualLeave, formatYearsOfService } from '@/lib/leaveUtils';
import { userDB } from '@/lib/employeeDB';
import { Timestamp } from 'firebase/firestore';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import Card from '@/components/Card';
import Button from '@/components/Button';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [pendingLeavesCount, setPendingLeavesCount] = useState(0);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const currentUser = getCurrentUser();
        if (!currentUser) {
          router.push('/login');
          return;
        }

        // 從 Firestore 重新獲取最新的使用者資料
        const freshUserData = await userDB.getUserById(currentUser.id);
        if (!freshUserData) {
          console.error('無法從資料庫獲取使用者資料');
          router.push('/login');
          return;
        }

        setUser(freshUserData);
        setIsAdmin(currentUser.id === 'admin');

        // 獲取需要審核的請假申請數量
        const leavesQuery = query(
          collection(db, 'leaves'),
          where('status', '==', 'pending')
        );
        const leavesSnapshot = await getDocs(leavesQuery);
        const leavesData = leavesSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Leave[];

        // 過濾出需要當前用戶審核的申請
        const pendingLeaves = leavesData.filter(leave => leave.currentApprovers.includes(currentUser.id));

        setPendingLeavesCount(pendingLeaves.length);
        setLoading(false);
      } catch (error) {
        console.error('載入使用者資料時發生錯誤:', error);
        setLoading(false);
      }
    };

    loadUserData();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-2xl text-gray-600 dark:text-gray-400">載入中...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-2xl text-red-600 dark:text-red-400">無法載入使用者資料</div>
      </div>
    );
  }

  // 計算年資和年假
  let annualLeaveTotal = 0;
  let yearsOfService = '計算中...';

  try {
    // 檢查並轉換 start_date
    let startDate: Date | null = null;

    if (user.start_date) {
      if (typeof user.start_date.toDate === 'function') {
        // 如果是 Timestamp 物件
        startDate = user.start_date.toDate();
      } else if (user.start_date.seconds && user.start_date.nanoseconds) {
        // 如果是序列化的 Timestamp 資料
        startDate = new Timestamp(
          user.start_date.seconds,
          user.start_date.nanoseconds
        ).toDate();
      }
    }

    if (startDate && !isNaN(startDate.getTime())) {
      annualLeaveTotal = calculateAnnualLeave(startDate);
      yearsOfService = formatYearsOfService(startDate);
    } else {
      console.error('到職日期無效或未設定');
      yearsOfService = '無法計算';
    }
  } catch (error) {
    console.error('計算年資時發生錯誤:', error);
    yearsOfService = '無法計算';
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        <Card className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2 text-gray-900 dark:text-white">歡迎回來，{user.name}</h1>
              <p className="text-lg text-gray-600 dark:text-gray-400">年資：{yearsOfService}</p>
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card>
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">快速連結</h2>
            <div className="space-y-2">
              {isAdmin ? (
                <>
                  <Button
                    variant="secondary"
                    onClick={() => router.push('/admin/password')}
                    className="w-full justify-start"
                  >
                    密碼管理
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => router.push('/profile')}
                    className="w-full justify-start"
                  >
                    個人資料設定
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="secondary"
                    onClick={() => router.push('/services/new')}
                    className="w-full justify-start"
                  >
                    建立服務紀錄
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => router.push('/leaves/new')}
                    className="w-full justify-start"
                  >
                    申請請假
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => router.push('/profile')}
                    className="w-full justify-start"
                  >
                    個人資料設定
                  </Button>
                </>
              )}
            </div>
          </Card>

          <Card>
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">待處理事項</h2>
            <div className="space-y-2">
              {pendingLeavesCount > 0 ? (
                <Button
                  variant="secondary"
                  onClick={() => router.push('/leaves/review')}
                  className="w-full justify-between"
                >
                  <span>抄送給我的請假審核</span>
                  <span className="text-blue-600 dark:text-blue-400 font-medium">{pendingLeavesCount} 筆</span>
                </Button>
              ) : (
                <p className="text-gray-500 dark:text-gray-400">尚無待處理事項</p>
              )}
            </div>
          </Card>

          <Card>
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">系統公告</h2>
            <div className="text-gray-500 dark:text-gray-400">
              <p>歡迎使用 CrewFlow 內部管理系統</p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
} 