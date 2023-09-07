import * as React from "react";

import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { Box, ButtonGroup, FormControl, FormControlLabel, FormGroup, Grid, Paper, TextField } from "@mui/material";
import { fillitemApi } from "../../api/fillterItemApi";
import Checkbox from '@mui/material/Checkbox';
import "../../css/style.css";
import { UserContext } from "../../context/userContext";
import { useNavigate } from "react-router-dom";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  width: "900px",
  height: "500px",
  transform: "translate(-50%, -50%)",
  border: "transparent",
  p: 4,
};

export default function FilterModal({ open, handleClose }) {
  const [max, setMax] = React.useState('');
  const [min, setMin] = React.useState('');
  const [room, setRoom] = React.useState('');
  const [typeRoom, setTypeRoom] = React.useState([
    "HOUSE",
    "APARTMENT",
    "GUEST_HOUSE",
    "HOTEL"
  ]);
  const [service, setService] = React.useState([]);
  const { FilterModal } = React.useContext(UserContext);


  const [listAllFilter, setlistAllFilter] = React.useState([]);
  React.useEffect(() => {
    listFilter();
  }, [])

  const showData = () => {
    FilterModal(max, min, typeRoom, service);
    handleClose();
  }

  const listFilter = async () => {
    const res = await fillitemApi();
    if (res && res.data) {
      setlistAllFilter(res.data.amenities);
    }
  }
  // console.log("=",checkbox);
  // console.log("service",service);
  // console.log("room",typeRoom);
  const handleCheckboxRoom = (event) => {
    const { value, checked } = event.target;
    if (checked) {
      setTypeRoom((prevValues) => [...prevValues, value]);
    } else {
      setTypeRoom((prevValues) => prevValues.filter((val) => val !== value));
    }
  };


  const handleCheckboxService = (event, value) => {
    const isChecked = event.target.checked;
    if (isChecked) {
      setService((prevValues) => [...prevValues, value]);
    } else {
      setService((prevValues) => prevValues.filter((val) => val !== value));
    }
  };

  return (
    <div>
      <Modal open={open} onClose={handleClose} >

        <Paper
          elevation={3}
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            width: "700px",
            height: "500px",
            transform: "translate(-50%, -50%)",
            border: "none",
            outline: 'none',
            p: 4,
            overflow: "auto",
            zIndex: 2,
          }}
        >
          <Typography variant="h5">Price</Typography>
          <Box display="flex" alignItems="center" justifyContent="center" gap={2}>
            <TextField value={min} onChange={(e) => setMin(e.target.value)} label="Min" variant="outlined" />
            <Typography variant="h6" component="span" sx={{ mx: 2 }}>-</Typography>
            <TextField value={max} onChange={(e) => setMax(e.target.value)} label="Max" variant="outlined" />
          </Box>


          <Typography variant="h5">Room and bedroom</Typography>
          <Box>
            <ButtonGroup
              variant="contained"
              aria-label="Số phòng ngủ"
              fullWidth
            >
              {["Any", 1, 2, 3, 4, 5, 6, 7, 8].map((value) => (
                <Button
                  key={value}
                  onClick={() => setRoom(value)}
                >
                  {value}
                </Button>
              ))}
            </ButtonGroup>
          </Box>
          <Box>
            <FormControl>
              <Typography variant="h5">Type of house/room</Typography>
              <FormGroup row>
                <Grid container spacing={7}>
                  <Grid item xs={12} sm={6} md={3}>
                    <FormControlLabel
                      label='House'
                      control={<Checkbox value='HOUSE' checked={typeRoom.includes('HOUSE')} onChange={handleCheckboxRoom} />}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <FormControlLabel
                      label='Hotel'
                      control={<Checkbox value='HOTEL' checked={typeRoom.includes('HOTEL')} onChange={handleCheckboxRoom} />}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <FormControlLabel
                      label='Apartment'
                      control={<Checkbox value='APARTMENT' checked={typeRoom.includes('APARTMENT')} onChange={handleCheckboxRoom} />}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <FormControlLabel
                      label='Guest_House'
                      control={<Checkbox value='GUEST_HOUSE' checked={typeRoom.includes('GUEST_HOUSE')} onChange={handleCheckboxRoom} />}
                    />
                  </Grid>

                </Grid>
              </FormGroup>
            </FormControl>
          </Box>

          <Box>
            <FormControl>
              <Typography variant="h5">Service</Typography>
              <FormGroup row>
                <Grid container spacing={3}>
                  {listAllFilter &&
                    listAllFilter.length > 0 &&
                    listAllFilter.map((item, index) => (
                      <Grid item xs={12} sm={6} md={3}>
                        <FormControlLabel
                          label={item.name}
                          control={<Checkbox value={item.id}
                            checked={service.includes(item.id)}
                            onChange={(event) => handleCheckboxService(event, item.id)}

                          />}
                        />
                      </Grid>
                    ))}
                </Grid>
              </FormGroup>
            </FormControl>
          </Box>
          <div
            style={{
              backgroundColor: "#f5f5f5",
              padding: "12px",
              textAlign: "center",
              position: "sticky",
              bottom: 0,
              zIndex: 1,
              display: "flex",
              float: "right",
              width: "15%",

            }}
          >

            <Button onClick={() => showData()}>Show</Button>

          </div>
        </Paper>

      </Modal>
    </div>
  );
}
