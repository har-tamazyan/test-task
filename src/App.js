
import React, {useState, useEffect, useMemo} from 'react'
import styles from './App.module.css'

import logs from './logs.json';

import RechartsComponent from 'libs/ui/recharts/RechartsComponent';

import {parseUsers} from 'utils'

function App() {
  const [loading, setLoading] = useState(false);

  const [users, setUsers] = useState([]);

  const userLogs = useMemo(() => {
    const userLogs = {};

    users.forEach(user => {
      userLogs[user.Id] = {
        impression: 0,
        conversion: 0,
        revenue: 0,
        conversionChartData: {}
      }

      logs.forEach(log => {
        if (log.user_id === user.Id) {
          if (log.type === 'impresssion') {
            userLogs[log.user_id].impression += 1 
          }
          else if (log.type === 'conversion') {
            userLogs[log.user_id].conversion += 1;

            const logTime = new Date(log.time);

            const chartDataKey = `${logTime.getFullYear()}-${logTime.getMonth() + 1}-${logTime.getDate()}`;

            userLogs[log.user_id].conversionChartData[chartDataKey] = {
              conversion: 0
            }

           

            userLogs[log.user_id].conversionChartData[chartDataKey].conversion += log.revenue
          }

          userLogs[log.user_id].revenue += log.revenue
        }
      })

      const conversionChartDataKeys = Object.keys(userLogs[user.Id].conversionChartData);
      
      userLogs[user.Id].chartDataRangeLabels = {
        start: conversionChartDataKeys[0],
        end: conversionChartDataKeys.at(-1)
      }

      userLogs[user.Id].conversionChartData = Object.values(userLogs[user.Id].conversionChartData);     
    })

    return userLogs;
  }, [users]);

  const fetchUsers =  () => {
    setLoading(true);

    fetch('https://api.airtable.com/v0/appBTaX8XIvvr6zEC/Users?maxRecords=3&amp;view=Grid%20view', {
      method: "GET",
      mode: 'cors', 
      headers: {
          'Authorization': 'Bearer key4v56MUqVr9sNJv'
        }
    })
    .then(response => response.json())
    .then(json => {
      const {records: users} = json;
      
      setUsers(parseUsers(users));

      setLoading(false);
    });
  };

  useEffect(() => {
    fetchUsers();
  }, [])



  if (loading) {
    return <h1>LOADING...</h1>
  }
  
  return (
    <div className={styles.app}>
      {
        users.map(user => (
          <div className={styles.cardItem} key={user.Id}>
            <div className={styles.userInfoBlock}>
              <div className={styles.avatarBlock}>
                {
                  user.avatar ? <img className={styles.avatar} src={user.avatar} alt="avatar" /> : <div className={styles.firstLetter}>{user.Name[0]}</div>
                }
              </div>
              <div className={styles.nameBlock}>
                <div className={styles.nameTitle}>{user.Name}</div>
                <div className={styles.occupation}>{user.occupation}</div>
              </div>
            </div>
            <div className={styles.restDataBlock}>
              <div className={styles.chartBlock}>
                <div className={styles.chartsContainer}>
                  <RechartsComponent data={userLogs[user.Id].conversionChartData} dataKey={'conversion'} />
                </div>
                <div className={styles.chartsInfo}>
                  Conversions {new Date(userLogs[user.Id].chartDataRangeLabels.start).getMonth() + 1}/{new Date(userLogs[user.Id].chartDataRangeLabels.start).getDate()} - {' '}
                  {new Date(userLogs[user.Id].chartDataRangeLabels.end).getMonth() + 1}/{new Date(userLogs[user.Id].chartDataRangeLabels.end).getDate()}
                </div>
              </div>
              <div className={styles.logsBlock}>
                <div className={styles.impressionBlock}>
                 <span className={`${styles.logValue} ${styles.impressionValue}`}>{userLogs[user.Id].impression}</span>
                 <br />
                 <span className={styles.logLabel}>impressions</span>
                </div>
                <div className={styles.comversionBlock}>
                <span className={`${styles.logValue} ${styles.conversionValue}`}>{userLogs[user.Id].conversion}</span>
                <br />
                 <span className={styles.logLabel}>conversions</span>
                </div>
                <div className={styles.revenueBlock}>
                <span>{`$${userLogs[user.Id].revenue.toFixed(2)}`}</span>
                </div>
              </div>
            </div>
          </div>
        ))
      }
    </div>
  );
}

export default App;
