/* React page for other health tracking */
import Navbar from "../../components/navbar/navbar";
import "./otherHealthTracker.scss";
import { useContext, useState, useEffect, useRef } from "react";
import { AuthContext } from "../../utils/authentication/auth-context";
import axios from "axios";
//basic ui
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  Paper,
  Stack,
  Button
} from "@mui/material";
//icons
import LocalDrinkIcon from '@mui/icons-material/LocalDrink'; // water icon
import BedIcon from '@mui/icons-material/Bed'; // sleep icon
import ScaleIcon from '@mui/icons-material/Scale'; // weight icon
import MedicationIcon from '@mui/icons-material/Medication'; // supplement icon
//tab structure
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { LineChart, BarChart, axisClasses } from '@mui/x-charts';

// TabPanel setup
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      display="flex"
      {...other}
    >
      {value === index && (
        <Box component='div' sx={{ p: 1 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

// TabPanel field setup
TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

// Prop for each tab
function a11yProps(index) {
  return {
    id: `full-width-tab-${index}`,
    'aria-controls': `full-width-tabpanel-${index}`,
  };
}
const activityMap = new Map();
activityMap.set("Sedentary", 0);
activityMap.set("[none]", 0);
activityMap.set("Lightly Active", 1);
activityMap.set("Moderately Active", 2);
activityMap.set("Very Active", 3);
activityMap.set("Extremely Active", 4);

const OtherHealthTracker = () => {
  const { user } = useContext(AuthContext);
  const userId = user._id;

  // For tab component
  const [value, setValue] = useState(0); // the supplement log displayed
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  // tracker log states
  const [weightLog, setWeightLog] = useState([]); // the weight log displayed
  const [sleepLog, setSleepLog] = useState([]); // the sleep log displayed
  const [waterLog, setWaterLog] = useState([]); // the water log displayed
  const [supplementLog, setSupplementLog] = useState([]); // the supplement log displayed
  const [recommendedWater, setRecommendedWater] = useState(0) // water recommendation based on formula
  const [activity, setActivity] = useState('')

  /* Input states corresponding to each input box */
  // weight tracking:
  const [weightAmt, setWeightAmt] = useState('');
  const [weightDate, setWeightDate] = useState('');
  // water tracking:
  const [waterIntake, setWaterIntake] = useState('');
  const [waterDate, setWaterDate] = useState('');
  // sleep tracking:
  const [sleepLength, setSleepLength] = useState('');
  const [sleepDate, setSleepDate] = useState('');
  // supp tracking:
  const [suppName, setSupplement] = useState('');
  const [suppAmt, setSuppAmt] = useState('');
  const [suppDate, setSuppDate] = useState('');

  /* comparator function for date sorting */
  function compare(a, b) {
    if (a.date < b.date) {
      return -1;
    }
    if (a.date > b.date) {
      return 1;
    }
    return 0;
  }
  /* Load entry items on page render */
  const isFirstRender = useRef(true);
  useEffect(() => {
    // Get entries on load
    const getAllEntries = async () => {
      try {
        // causing errors right now
        const weightRes = await axios.get(`users/weights/${userId}`, {
          headers: { token: `Bearer ${user.accessToken}` }
        });
        const waterRes = await axios.get(`users/water/${userId}`, {
          headers: { token: `Bearer ${user.accessToken}` }
        });
        const sleepRes = await axios.get(`users/sleep/${userId}`, {
          headers: { token: `Bearer ${user.accessToken}` }
        });
        const suppRes = await axios.get(`users/supplement/${userId}`, {
          headers: { token: `Bearer ${user.accessToken}` }
        });
        const activityRes = await axios.get(`/users/activityInfo/${userId}`, {
          headers: { token: `Bearer ${user.accessToken}` }
        });

        console.log(`Bearer ${user.accessToken}`);
        const resActivityLevel = activityRes.data.length === 0 ? "[none]" : activityRes.data[0].activityLevel;

        setWeightLog(weightRes.data.sort(compare));
        setWaterLog(waterRes.data.sort(compare));
        setSleepLog(sleepRes.data.sort(compare));
        setSupplementLog(suppRes.data.sort(compare));
        setActivity(resActivityLevel);
      } catch (error) {
        console.error(error);
      }
    };
    /* only run on first render */
    if (isFirstRender.current) {
      getAllEntries();
    }
    isFirstRender.current = false;
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    // calculate value
    const updateWaterRec = async () => {
        let latestWeight;
        if (weightLog.at(-1)) {
            latestWeight = parseInt(weightLog.at(-1).weight);
        }
      let activityMapping = activityMap.get(activity);
      setRecommendedWater(Math.round(((latestWeight * 0.5 + 12 * activityMapping * 0.25) / 8) / .5) * .5);
    };
    if (waterLog.length > 0) {
      updateWaterRec();
    }
    // eslint-disable-next-line
  }, [weightLog, activity]);

  const handleAddWeight = async () => {
    try {
      const res = await axios.put(
        `users/weight/${userId}`,
        { "weight": weightAmt, "date": weightDate },
        { headers: { token: `Bearer ${user.accessToken}` } }
      );

      // Reflect new weight log changes
      setWeightLog(res.data.weightLog);

      // Clear all weight fields
      setWeightAmt('');
      setWeightDate('');
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddSleep = async () => {
    try {
      const res = await axios.put(
        `users/sleep/${userId}`,
        { "length": sleepLength, "date": sleepDate },
        { headers: { token: `Bearer ${user.accessToken}` } }
      );

      // Reflect new sleep log changes
      setSleepLog(res.data.sleepLog);

      // Clear all sleep fields
      setSleepLength('');
      setSleepDate('');
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddWater = async () => {
    try {
      const res = await axios.put(
        `users/water/${userId}`,
        { "intake": waterIntake, "date": waterDate },
        { headers: { token: `Bearer ${user.accessToken}` } }
      );

      // Reflect new water log changes
      setWaterLog(res.data.waterLog);

      // Clear all water fields
      setWaterIntake('');
      setWaterDate('');
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddSupps = async () => {
    try {
      const res = await axios.put(
        `users/supplement/${userId}`,
        { "supplement": suppName, "amount": suppAmt, "date": suppDate },
        { headers: { token: `Bearer ${user.accessToken}` } }
      );

      // Reflect new supp log changes
      setSupplementLog(res.data.suppLog);

      // Clear all supp fields
      setSupplement('');
      setSuppAmt('');
      setSuppDate('');
    } catch (error) {
      console.error(error);
    }
  };

  function formatTime(date) {
    const currentDate = new Date(date);
    const hours = currentDate.getHours();
    const minutes = currentDate.getMinutes();
    const amOrPm = hours >= 12 ? 'PM' : 'AM';
    const hours12 = hours % 12 || 12; // 0 should be converted to 12 for 12 AM
    const formattedTime = `${hours12.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')} ${amOrPm}`;
    return formattedTime;
  }

  function formatDate(date) {
    const currentDate = new Date(date);
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const day = String(currentDate.getDate()).padStart(2, '0');
    const formattedDate = `${month}/${day}/${year}`;
    return formattedDate;
  }

  // Use to provide links to edit entries later
  function listWeights(entry) { // display a menu item
    const weight = entry.weight;
    const date = formatDate(entry.date);
    // const id = item.hash;

    return (
      <ListItemButton component="div" disablepadding='true'>
        <span className="header">{`${weight} lbs | ${date}`}</span>
      </ListItemButton>
    );
  }
  function listWater(entry) { // display a menu item
    const intake = entry.intake;
    const date = formatDate(entry.date);
    // const id = item.hash;

    return (
      <ListItemButton component="div" disablepadding='true'>
        <span className="header">{`${intake} cups | ${date}`}</span>
      </ListItemButton>
    );
  }
  function listSleep(entry) { // display a menu item
    const length = entry.length;
    const date = formatDate(entry.date);
    const time = formatTime(entry.date);
    // const id = item.hash;

    return (
      <ListItemButton component="div" disablepadding='true'>
        <span className="header">{`${length} hours | ${date} ${time}`}</span>
      </ListItemButton>
    );
  }
  function listSupplements(entry) { // display a menu item
    const supplement = entry.supplement;
    const amount = entry.amount;
    const date = formatDate(entry.date)
    // const id = item.hash;

    return (
      <ListItemButton component="div" disablepadding='true'>
        <span className="header">{`${supplement}, ${amount} | ${date}`}</span>
      </ListItemButton>
    );
  }

  let weightchart;
  if (weightLog.length > 0) {
    weightchart =
      <LineChart
        xAxis={[{ scaleType: 'utc', data: weightLog.map(item => { return (new Date(item.date)) }) }]}
        series={[
          {
            data: weightLog.map(item => { return (parseInt(item.weight)) }),
            showMark: ({ index }) => index,
          },
        ]}
        width={500}
        height={300}
      />;
  } else {
    weightchart =
      <h4>chart not populated yet...</h4>
  }
  let sleepchart;
  if (sleepLog.length > 0) {
    sleepchart =
      <LineChart
        xAxis={[{ scaleType: 'utc', data: sleepLog.map(item => { return (new Date(item.date)) }) }]}
        series={[
          {
            data: sleepLog.map(item => { return (parseInt(item.length)) }),
            showMark: ({ index }) => index,
          },
        ]}
        width={500}
        height={300}
      />;
  } else {
    sleepchart =
      <h4>chart not populated yet...</h4>
  }
  let waterchart;
  if (waterLog && waterLog.length > 0) {
    waterchart =
      <LineChart
        xAxis={[{ scaleType: 'utc', data: waterLog.map(item => { return (new Date(item.date)) }) }]}
        series={[
          {
            data: waterLog.map(item => { return (parseInt(item.intake)) }),
            showMark: ({ index }) => index,
          },
        ]}
        width={500}
        height={300}
      />;
  } else {
    waterchart =
      <h4>chart not populated yet...</h4>
  }

  return (
    <div className="menu">
      <Navbar />
      <Box
        sx={{
          height: 600,
          width: 1200,
          borderRadius: 2,
          border: 1,
          borderColor: 'white'
        }}
      >
        <Tabs
          value={value}
          textColor="white"
          variant="fullWidth"
          onChange={handleChange}
          aria-label="Vertical tabs example"
          sx={{ borderRight: 1, borderColor: 'divider' }}
        >
          <Tab icon={<ScaleIcon />} iconPosition="start" aria-label="scale" label="Weight" {...a11yProps(0)} />
          <Tab icon={<BedIcon />} iconPosition="start" aria-label="sleep" label="Sleep" {...a11yProps(1)} />
          <Tab icon={<LocalDrinkIcon />} iconPosition="start" aria-label="water" label="Water" {...a11yProps(2)} />
          <Tab icon={<MedicationIcon />} iconPosition="start" aria-label="supps" label="Supplements" {...a11yProps(3)} />
        </Tabs>
        {/* Weight content tab */}
        <TabPanel className="contents tab" value={value} index={0} >
          <Stack className="tab container" spacing={0} direction="row">
            <Stack className="contents stack" width={"40%"} spacing={0} alignItems={"center"} justifyContent={"center"}>
              <h4>{"View weights"}</h4>
              <Box sx={{ width: '100%', height: 370, maxWidth: 360, bgcolor: 'background.paper', borderRadius: 5 }} className="list">
                <Paper style={{ maxHeight: 400, overflow: 'auto' }}>
                  <List>
                    {weightLog?.map((entry) => listWeights(entry))}
                  </List>
                </Paper>
              </Box>
            </Stack>
            {/* weight bar chart */}
            <Stack className="contents stack" spacing={0} alignItems={"center"} justifyContent={"center"}>
              <Box>
                <h4 className="sectionTitle">{"Weight Progression"}</h4>
              </Box>
              <Box>
                {weightchart}
              </Box>
            </Stack>
            <Box className="entry" sx={{ width: '40%' }}>
              <Stack className="stack" spacing={2} ml={"50px"}>
                <h4>{"Add entry"}</h4>
                <div className="filter">
                  <Box sx={{ minWidth: 120 }}>
                    <div> {"Weight: "}</div>
                    <input type="number" value={weightAmt} onChange={(e) => setWeightAmt(e.target.value)} />
                    <div> {"Date: "}</div>
                    <input type="date" value={weightDate} onChange={(e) => setWeightDate(e.target.value)} />
                  </Box>
                </div>
                <Button variant="contained" color="success" size="large" className="button" onClick={handleAddWeight}> Add Entry </Button>
              </Stack>
            </Box>
          </Stack>
        </TabPanel>

        {/* Sleep content tab */}
        <TabPanel className="contents tab" value={value} index={1} >
          <Stack className="tab container" spacing={0} direction="row">
            <Stack className="contents stack" width={"40%"} spacing={0} alignItems={"center"} justifyContent={"center"}>
              <h4>{"View sleep"}</h4>
              <Box sx={{ width: '100%', height: 370, maxWidth: 360, bgcolor: 'background.paper', borderRadius: 5 }} className="list">
                <Paper style={{ maxHeight: 400, overflow: 'auto' }}>
                  <List>
                    {sleepLog?.map((entry) => listSleep(entry))}
                  </List>
                </Paper>
              </Box>
            </Stack>
            {/* sleep bar chart */}
            <Stack className="contents stack" spacing={0} alignItems={"center"} justifyContent={"center"}>
              <Box>
                <h4 className="sectionTitle">{"Sleep record"}</h4>
              </Box>
              <Box>
                {sleepchart}
              </Box>
            </Stack>
            <Box className="entry" sx={{ width: '40%' }}>
              <Stack className="stack" spacing={2} ml={"50px"}>
                <h4>{"Add entry"}</h4>
                <div className="filter">
                  <Box sx={{ minWidth: 120 }}>
                    <div> {"Length: "}</div>
                    <input type="number" value={sleepLength} onChange={(e) => setSleepLength(e.target.value)} />
                    <div> {"Date: "}</div>
                    <input type="datetime-local" value={sleepDate} onChange={(e) => setSleepDate(e.target.value)} />
                  </Box>
                </div>
                <Button variant="contained" color="success" size="large" className="button" onClick={handleAddSleep}> Add Entry </Button>
              </Stack>
            </Box>
          </Stack>
        </TabPanel>

        {/* Water content tab */}
        <TabPanel className="contents tab" value={value} index={2} >
          <Stack className="tab container" spacing={0} direction="row">
            <Stack className="contents stack" width={"40%"} spacing={0} alignItems={"center"} justifyContent={"center"}>
              <h4>{"View water intake"}</h4>
              <Box sx={{ width: '100%', height: 370, maxWidth: 360, bgcolor: 'background.paper', borderRadius: 5 }} className="list">
                <Paper style={{ maxHeight: 400, overflow: 'auto' }}>
                  <List>
                    {waterLog?.map((entry) => listWater(entry))}
                  </List>
                </Paper>
              </Box>
            </Stack>
            {/* water bar chart */}
            <Stack className="contents stack" spacing={0} alignItems={"center"} justifyContent={"center"}>
              <Box>
                <h4 className="sectionTitle">{"Water record"}</h4>
              </Box>
              <Box>
                {waterchart}
              </Box>
            </Stack>
            <Box className="entry" sx={{ width: '40%' }}>
              <Stack className="stack" justifyItems={"center"} justifyContent={"center"} spacing={2} ml={"50px"}>
                <h4>{"Add entry"}</h4>
                <div className="filter">
                  <Box sx={{ minWidth: 120 }}>
                    <div> {"Intake (cups): "}</div>
                    <input type="number" value={waterIntake} onChange={(e) => setWaterIntake(e.target.value)} />
                    <div> {"Date: "}</div>
                    <input type="date" value={waterDate} onChange={(e) => setWaterDate(e.target.value)} />
                  </Box>
                </div>
                <Button variant="contained" color="success" size="large" className="button" onClick={handleAddWater}> Add Entry </Button>
                <Paper style={{
                  maxWidth: 250,
                  maxHeight: 355,
                }}
                  elevation={3}>
                  <List>
                    <ListItem
                      component="div"
                      disablePadding
                      sx={{
                        paddingLeft: '16px', // Add left padding
                        paddingRight: '4px', // Add left padding
                        borderBottom: '1px solid #e0e0e0', // Line between items
                        marginBottom: '8px', // Spacing between items
                        paddingBottom: '8px', // Padding at the bottom of the item
                        paddingTop: '4px', // Add left padding
                      }}
                    >
                      <b>Recommended Water Intake:</b>
                    </ListItem>
                    <ListItem>
                      {recommendedWater + " cups"}
                    </ListItem>
                  </List>
                </Paper>
              </Stack>
            </Box>
          </Stack>
        </TabPanel>

        {/* Supplement content tab */}
        <TabPanel className="contents tab" value={value} index={3} >
          <Stack className="tab container" spacing={0} direction="row">
            <Stack className="contents stack" width={"40%"} spacing={0} alignItems={"center"} justifyContent={"center"}>
              <h4>{"View supplement intake"}</h4>
              <Box sx={{ width: '100%', height: 370, maxWidth: 360, bgcolor: 'background.paper', borderRadius: 5 }} className="list">
                <Paper style={{ maxHeight: 400, overflow: 'auto' }}>
                  <List>
                    {supplementLog?.map((entry) => listSupplements(entry))}
                  </List>
                </Paper>
              </Box>
            </Stack>
            <Box className="entry" sx={{ width: '40%' }}>
              <Stack className="stack" spacing={2} ml={"50px"}>
                <h4>{"Add entry"}</h4>
                <div className="filter">
                  <Box sx={{ minWidth: 120 }}>
                    <div> {"Supplement:"}</div>
                    <input type="string" value={suppName} onChange={(e) => setSupplement(e.target.value)} />
                    <div> {"Intake (pills): "}</div>
                    <input type="number" value={suppAmt} onChange={(e) => setSuppAmt(e.target.value)} />
                    <div> {"Date: "}</div>
                    <input type="date" value={suppDate} onChange={(e) => setSuppDate(e.target.value)} />
                  </Box>
                </div>
                <Button variant="contained" color="success" size="large" className="button" onClick={handleAddSupps}> Add Entry </Button>
              </Stack>
            </Box>
          </Stack>
        </TabPanel>
      </Box>
    </div>
  );

};

export default OtherHealthTracker;
