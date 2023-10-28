/* React page for other health tracking */
import Navbar from "../../components/navbar/navbar";
import "./otherHealthTracker.scss";
import { useContext, useState, useEffect, useRef } from "react";
import { AuthContext } from "../../utils/authentication/auth-context";
import axios from "axios";
import { makeStyles } from "@material-ui/core/styles";
//basic ui
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import Paper from '@mui/material/Paper';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Stack from "@mui/material/Stack";
import Button from '@mui/material/Button';
//icons
import LocalDrinkIcon from '@mui/icons-material/LocalDrink'; // water icon
import BedIcon from '@mui/icons-material/Bed'; // sleep icon
import ScaleIcon from '@mui/icons-material/Scale'; // weight icon
import MedicationIcon from '@mui/icons-material/Medication'; // supplement icon
//tab structure
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';

const useStyles = makeStyles((theme) => ({
  root: {
    color: "black",
  },
  selected: {
    color: "white"
  }
}));
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
  const [suppLog, setSuppLog] = useState([]); // the supplement log displayed

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

  /* Load entry items on page render */
  const isFirstRender = useRef(true);
  useEffect(() => {
    // Get entries on load
    const getAllEntries = async () => {
      try {
        const response1 = await axios.get([`users/weight/${userId}`, {
          headers: { token: `Bearer ${user.accessToken}` }
        }]);

        const response2= await axios.get(`users/water/${userId}`, {
          headers: { token: `Bearer ${user.accessToken}` }
        });

        const response3 = await axios.get(`users/sleep/${userId}`, {
          headers: { token: `Bearer ${user.accessToken}` }
        });

        const response4 = await axios.get(`users/supplement/${userId}`, {
          headers: { token: `Bearer ${user.accessToken}` }
        });
        setWeightLog(response1.data);
        setWaterLog(response2.data);
        setSleepLog(response3.data);
        setSuppLog(response4.data);
      } catch (error) {
        console.log(error);
      }
    };

    /* only run on first render */
    if (isFirstRender.current) {
      getAllEntries();
    }
    isFirstRender.current = false;
    // eslint-disable-next-line
  }, []);

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
  const handleAddSleep = async () => {
    try {
      ///////keep this
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
  const handleAddSupps = async () => {
    try {
      const res = await axios.put(
        `users/supplement/${userId}`,
        { "supplement": suppName, "amount": suppAmt, "date": suppDate },
        { headers: { token: `Bearer ${user.accessToken}` } }
      );

      // Reflect new supp log changes
      setSuppLog(res.data.suppLog);

      // Clear all supp fields
      setSupplement('');
      setSuppAmt('');
      setSuppDate('');
    } catch (error) {
      console.error(error);
    }
  };

  function formatDate(date) {
    const currentDate = new Date(date);
    const hours = currentDate.getHours();
    const minutes = currentDate.getMinutes();
    // Determine whether it's AM or PM
    const amOrPm = hours >= 12 ? 'PM' : 'AM';
    // Convert hours to 12-hour format
    const hours12 = hours % 12 || 12; // 0 should be converted to 12 for 12 AM
    // Format the time as a string in 12-hour format
    const formattedTime = `${hours12.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')} ${amOrPm}`;

    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const day = String(currentDate.getDate()).padStart(2, '0');
    // Format the date as a string
    const formattedDate = `${month} - ${day} - ${year}`
    return { formattedDate, formattedTime }
  }

  // Use to provide links to edit entries later
  function listWeights(entry) { // display a menu item
    const weight = entry.weight;
    const date = entry.date;
    // const id = item.hash;

    return (
      <ListItemButton component="div" disablePadding>
        <span className="header">{`${weight} lbs | ${date}`}</span>
      </ListItemButton>
    );
  }
  function listWater(entry) { // display a menu item
    const intake = entry.intake;
    const date = entry.date;
    // const id = item.hash;

    return (
      <ListItemButton component="div" >
        <span className="header">{`${intake} cups | ${date}`}</span>
      </ListItemButton>
    );
  }
  function listSleep(entry) { // display a menu item
    const length = entry.length;
    const date = entry.date;
    // const id = item.hash;

    return (
      <ListItemButton component="div" >
        <span className="header">{`${length} hours | ${date}`}</span>
      </ListItemButton>
    );
  }
  function listSupps(entry) { // display a menu item
    const supplement = entry.supplement;
    const amount = entry.amount;
    const date = entry.date;
    // const id = item.hash;

    return (
      <ListItemButton component="div" >
        <span className="header">{`${supplement}, ${amount} | ${date}`}</span>
      </ListItemButton>
    );
  }

  return (
    <div className="menu">
      <Navbar />
      <Box
        sx={{
          height: 500,
          width: 900,
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
        {/* weight */}
        <TabPanel value={value} index={0} >
          <Box sx={{ display: 'flex' }}>
            <Box sx={{ width: '40%' }}>
              <h4>{"View weights"}</h4>
              <Box sx={{ width: '100%', height: 370, maxWidth: 360, bgcolor: 'background.paper', borderRadius: 5 }} className="list">
                <Paper style={{ maxHeight: 400, overflow: 'auto' }}>
                  <List>
                    {weightLog.map((entry) => listWeights(entry))}
                  </List>
                </Paper>
              </Box>
            </Box>
            <Box sx={{ width: '40%' }}>
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
          </Box>
        </TabPanel>

        <TabPanel value={value} index={1}>
          <Box sx={{ display: 'flex' }}>
            <Box sx={{ width: '40%' }}>
              <h4>{"View sleep"}</h4>
              <Box sx={{ width: '100%', height: 370, maxWidth: 360, bgcolor: 'background.paper', borderRadius: 5 }} className="list">
                <Paper style={{ maxHeight: 400, overflow: 'auto' }}>
                  <List>
                    {sleepLog.map((entry) => listSleep(entry))}
                  </List>
                </Paper>
              </Box>
            </Box>
            <Box sx={{ width: '40%' }}>
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
          </Box>
        </TabPanel>

        <TabPanel value={value} index={2}>
          <Box sx={{ display: 'flex' }}>
            <Box sx={{ width: '40%' }}>
              <h4>{"View water intake"}</h4>
              <Box sx={{ width: '100%', height: 370, maxWidth: 360, bgcolor: 'background.paper', borderRadius: 5 }} className="list">
                <Paper style={{ maxHeight: 400, overflow: 'auto' }}>
                  <List>
                    {waterLog.map((entry) => listWater(entry))}
                  </List>
                </Paper>
              </Box>
            </Box>
            <Box sx={{ width: '40%' }}>
              <Stack className="stack" spacing={2} ml={"50px"}>
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
              </Stack>
            </Box>
          </Box>
        </TabPanel>
        
        <TabPanel value={value} index={3}>
          <Box sx={{ display: 'flex' }}>
            <Box sx={{ width: '40%' }}>
              <h4>{"View supplement intake"}</h4>
              <Box sx={{ width: '100%', height: 370, maxWidth: 360, bgcolor: 'background.paper', borderRadius: 5 }} className="list">
                <Paper style={{ maxHeight: 400, overflow: 'auto' }}>
                  <List>
                    {suppLog.map((entry) => listSupps(entry))}
                  </List>
                </Paper>
              </Box>
            </Box>
            <Box sx={{ width: '40%' }}>
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
          </Box>
        </TabPanel>
      </Box>
    </div>
  );

};

export default OtherHealthTracker;