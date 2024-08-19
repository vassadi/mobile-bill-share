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
import {
  currencyFormatter,
  getUserInfo,
  monthYearSortComparator,
} from '../../../utils';

import { useTranslation } from 'react-i18next';
import { MobileBrick } from '../../atoms/Bricks';
import KeyValueText from '../../atoms/KeyValueText/KeyValueText';
import StyledDiv from '../../atoms/StyledDiv/StyledDiv';

// import { OAuth2 } from 'oauth';

import Splitwise from 'splitwise';

const Dashboard = () => {
  const [activeIndex, setActiveIndex] = useState();
  const [data, setData] = useState('');
  const [months, setMonths] = useState([]);
  const [chunkDetails, setChunkDetails] = useState('');

  const { t } = useTranslation();

  const SPLITWISE_CONSUMER_KEY = 'FWoRUfxlLgJlAExfB1PjVq2N3VobCOK4sT8gheHD';
  const SPLITWISE_CONSUMER_SECRET = 'VZVMm8Ljrj96ldWVGt9mlq2dpG2LzvKzb75C5z1G';
  // const API_URL = 'https://secure.splitwise.com/api/v3.0/';

  const sw = Splitwise({
    consumerKey: SPLITWISE_CONSUMER_KEY,
    consumerSecret: SPLITWISE_CONSUMER_SECRET,
  });

  console.log(sw);

  sw.getCurrentUser()
    .then((result, x) => {
      console.log(result, x);
    })
    .catch((e) => {
      console.log(e);
    });

  // const oauth2 = new OAuth2(
  //   SPLITWISE_CONSUMER_KEY,
  //   SPLITWISE_CONSUMER_SECRET,
  //   'https://secure.splitwise.com/',
  //   null,
  //   'oauth/token',
  //   null
  // );

  // oauth2.getOAuthAccessToken(
  //   '',
  //   { grant_type: 'client_credentials' },
  //   (_, token) => {
  //     oauth2.get(`${API_URL}get_current_user/`, token, (_, data) => {
  //       const user = JSON.parse(data).user;
  //       console.log('U S E R  ', user);
  //     });
  //   }
  // );

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

  const handlePieClick = (data) => {
    setChunkDetails(data.payload.payload);
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
              <div className="flex flex-col gap-3 md:flex-row m-5">
                <ResponsiveContainer height={300} className={'basis-3/4'}>
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

                <ResponsiveContainer height={300} className={'basis-1/4'}>
                  {activeIndex ? (
                    <PieChart>
                      <Tooltip />
                      <Pie
                        onClick={handlePieClick}
                        data={data.monthlyBills[activeIndex].details}
                        cx={'50%'}
                        cy={'50%'}
                        outerRadius={120}
                        fill="#8884d8"
                        paddingAngle={2}
                        dataKey="totalCostPerLine"
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
              </div>
            </>
          )}

          <BillingDetails
            preSelectedMonth={activeIndex}
            handleSelectedMonthChange={(x) => setActiveIndex(x)}
          />

          <MobileBrick>
            {Object.keys(chunkDetails).length > 0 && (
              <StyledDiv background={'#fff'}>
                <h4 className="font-bold py-2.5">Charges</h4>
                <KeyValueText keyValue={['Name', chunkDetails?.name]} />
                <KeyValueText
                  keyValue={[
                    'Line cost',
                    currencyFormatter(chunkDetails?.lineCost || 0),
                  ]}
                />
                <KeyValueText
                  keyValue={[
                    'Device charges',
                    currencyFormatter(chunkDetails?.devices || 0),
                  ]}
                />
                <KeyValueText
                  keyValue={[
                    'Additoanl charges',
                    currencyFormatter(chunkDetails?.additional || 0),
                  ]}
                />

                <KeyValueText
                  keyValue={[
                    'Kickbacks',
                    currencyFormatter(chunkDetails?.kickbacks || 0),
                  ]}
                />
                <KeyValueText
                  keyValue={[
                    'Credits',
                    currencyFormatter(chunkDetails?.credits || 0),
                  ]}
                />
                <br></br>

                <KeyValueText
                  keyValue={[
                    'Total line charges',
                    currencyFormatter(chunkDetails?.totalCostPerLine || 0),
                  ]}
                  highlight="true"
                />
              </StyledDiv>
            )}
          </MobileBrick>
          <MobileBrick>
            <FlexDiv background={'#fff'} justify={'center'}>
              Thank You!
            </FlexDiv>
          </MobileBrick>
        </div>
      </LocalizationProvider>
    </UserContextProvider>
  );
};

export default Dashboard;
