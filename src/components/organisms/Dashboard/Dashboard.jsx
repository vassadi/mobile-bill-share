import { useEffect, useState } from 'react';
import {
  Bar,
  BarChart,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import BillingDetails from '../BillingDetails/BillingDetails';
import FlexDiv from '../../atoms/FlexDiv';
import {
  collection,
  getDocs,
  onSnapshot,
  query,
  where,
} from 'firebase/firestore';
import { store } from '../../../config/getClientConfig';
import { UserContextProvider } from '../../../context/userContext';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

import Header from '../../molecules/Header';
import { getUserInfo, monthYearSortComparator } from '../../../utils';

import { useTranslation } from 'react-i18next';

const Dashboard = () => {
  const [activeIndex, setActiveIndex] = useState();
  const [data, setData] = useState('');
  const [months, setMonths] = useState([]);

  const { t } = useTranslation();

  const userInfo = getUserInfo();
  const phoneNumber = userInfo?.phoneNumber?.slice(-10);

  const COLORS = [
    '#0088FE',
    '#00C49F',
    '#FFBB28',
    '#FF8042',
    'orangered',
    'olivedrab',
    'violet',
  ];

  useEffect(() => {
    const dataObject = {};

    const fetchData = async () => {
      try {
        // Get Group ID
        const usersRef = collection(store, 'users');
        const snap = query(usersRef, where('number', '==', phoneNumber));
        const docs = await getDocs(snap);
        docs.forEach((doc) => {
          const { groupId, isAdmin, name } = doc.data();
          dataObject.groupId = groupId;
          dataObject.isAdmin = isAdmin;
          dataObject.name = name;
          dataObject.monthlyBills = [];
        });

        const groupRef = collection(
          store,
          'groups',
          dataObject.groupId,
          'monthlyBills'
        );

        const userQuery = query(
          usersRef,
          where('groupId', '==', dataObject.groupId)
        );

        const groupQuery = query(groupRef);

        onSnapshot(userQuery, (querySnapshot) => {
          const usersList = [];
          // const snapChanges = querySnapshot.docChanges();
          querySnapshot.forEach((doc) => {
            usersList.push({ ...doc.data(), id: doc.id });
          });

          dataObject.usersList = usersList;
          console.log('Initial/Updated users: ', dataObject);

          setData(dataObject);
        });

        onSnapshot(groupQuery, (snapshot) => {
          snapshot.forEach((doc) => {
            dataObject.monthlyBills = doc.data();
          });

          console.log('Initial/Updated bills: ', dataObject);
          if (dataObject.monthlyBills) {
            const months = Object.keys(dataObject.monthlyBills)
              .sort(monthYearSortComparator)
              .reduce((a, x) => {
                const xx = { ...dataObject.monthlyBills[x], key: x };
                a.push(xx);
                return a;
              }, []);
            if (months.length) {
              setActiveIndex(months[0].key);
              setMonths(months);
            }
          }
          setData(dataObject);

          window.sessionStorage.setItem('app_data', JSON.stringify(dataObject));
        });
      } catch (e) {
        console.log('errror', e);
        throw new Error(e);
      }
      console.log('Data Object: ', dataObject);
    };

    document.getElementById('root').style.padding = 0;
    document.getElementsByTagName('body')[0].style.backgroundImage =
      'url("/src/assets/group_share.jpeg");';

    fetchData();
  }, []);

  const handleClick = (data) => {
    setActiveIndex(data.key);
  };

  if (!data) return null;

  return (
    <UserContextProvider value={data}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Header />
        <div className="contentRoot">
          {months.length > 0 && (
            <>
              <FlexDiv background={'#fff'} padding={'20px'}>
                <div>
                  <h2>Hi {data.name},</h2>
                  <p>{t('welcomeMessage')}</p>
                </div>
              </FlexDiv>
              <FlexDiv>
                <ResponsiveContainer width="70%" height={300}>
                  <BarChart data={months}>
                    <XAxis dataKey="key" />
                    <YAxis />
                    <Tooltip />
                    <Bar
                      dataKey="totalBill"
                      onClick={handleClick}
                      label={{ position: 'top' }}
                    >
                      {months.map((entry, index) => (
                        <Cell
                          cursor="pointer"
                          fill={
                            entry.key === activeIndex ? '#82ca9d' : '#8884d8'
                          }
                          key={`cell-${index}`}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>

                <ResponsiveContainer width="30%" height={300}>
                  {activeIndex ? (
                    <PieChart>
                      <Tooltip />
                      <Pie
                        data={data.monthlyBills[activeIndex].details}
                        cx={'50%'}
                        cy={'50%'}
                        outerRadius={120}
                        fill="#8884d8"
                        paddingAngle={2}
                        dataKey="costPerLine"
                      >
                        {data.monthlyBills[activeIndex].details.map(
                          (entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={COLORS[index % 12]}
                            />
                          )
                        )}
                      </Pie>
                    </PieChart>
                  ) : (
                    <div> Plese select graph to see the individual bill.</div>
                  )}
                </ResponsiveContainer>
              </FlexDiv>
            </>
          )}
          <BillingDetails
            preSelectedMonth={activeIndex}
            handleSelectedMonthChange={(x) => setActiveIndex(x)}
          />
        </div>
      </LocalizationProvider>
    </UserContextProvider>
  );
};

export default Dashboard;
