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
import FlexDiv from '../../molecules/FlexDiv';
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

const Dashboard = () => {
  const [activeIndex, setActiveIndex] = useState();
  const [data, setData] = useState('');
  const [months, setMonths] = useState([]);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  useEffect(() => {
    const fetchData = async () => {
      const userSession = sessionStorage.getItem('userInfo');
      const userInfo = userSession ? JSON.parse(userSession) : {};
      const phoneNumber = userInfo?.phoneNumber?.slice(-10);

      const dataObject = {};

      // Get Group ID
      const usersRef = collection(store, 'users');
      const snap = query(usersRef, where('number', '==', phoneNumber));
      const docs = await getDocs(snap);
      docs.forEach((doc) => {
        const { groupId, isAdmin } = doc.data();
        dataObject.groupId = groupId;
        dataObject.isAdmin = isAdmin;
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

        const months = Object.keys(dataObject.monthlyBills).reduce((a, x) => {
          const xx = { ...dataObject.monthlyBills[x], key: x };
          a.push(xx);
          return a;
        }, []);

        setActiveIndex(months[0].key);
        setMonths(months);
        setData(dataObject);
      });

      console.log('Data Object: ', dataObject);
    };

    document.getElementById('root').style.padding = 0;
    document.getElementsByTagName('body')[0].style.backgroundImage = 'none';

    fetchData();

    // return unsubscribe();
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
                        fill={entry.key === activeIndex ? '#82ca9d' : '#8884d8'}
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
                      {months.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                  </PieChart>
                ) : (
                  <div> Plese select graph to see the individual bill.</div>
                )}
              </ResponsiveContainer>
            </FlexDiv>
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
