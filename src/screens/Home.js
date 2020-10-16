import React, { Component, Fragment } from 'react';
import axios from 'axios';
import { makeStyles } from '@material-ui/core/styles';
import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/lab/Alert';
import Grid from '@material-ui/core/Grid';
import { Container, Select } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import MaterialUnderlineTextbox from '../components/MaterialUnderlineTextbox';
import MaterialButtonSuccess from '../components/MaterialButtonSuccess';
//import Button from '@material-ui/core/Button';
import MenuItem from '@material-ui/core/MenuItem';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import Box from '@material-ui/core/Box';
//import TrendingUpIcon from '@material-ui/icons/TrendingUp';
import FileCopyOutlinedIcon from '@material-ui/icons/FileCopyOutlined';
import CropFreeIcon from '@material-ui/icons/CropFree';
import Tooltip from '@material-ui/core/Tooltip';
import Zoom from '@material-ui/core/Zoom';
import Fade from '@material-ui/core/Fade';
//const illustration = require('../assets/images/illustration.png');
var QRCode = require('qrcode.react');
var validUrl = require('valid-url');

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
  },
  illustration: {
    marginLeft: theme.spacing(70),
    objectFit: 'contain',
    cursor: 'pointer',
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
}));

const keywords = [
  {
    value: 'dsctiet.xyz',
    label: 'dsctiet',
  },
  {
    value: 'other',
    label: 'Other',
  },
];

class HomeScreen extends Component {
  state = {
    longUrl: '',
    shortUrl: '',
    error: '',
    keyword: 'Domain',
    customUrl: '',
    views: '',
    date: '',
  };

  handleKeyword = event => {
    this.setState({
      keyword: event.target.value,
    });
  };

  handleChange = event => {
    this.setState({
      longUrl: event.target.value,
      shortUrl: '',
      customUrl: '',
      submitButton: false,
      cusUrlCheck: false,
      qrButton: false,
      getStats: false,
      copied: false,
    });
  };

  handleCopy = () => {
    this.setState({
      copied: true,
    });
  };
  handleQr = () => {
    this.setState({
      qrButton: true,
    });
  };
  handleStats = () => {
    this.setState({
      getStats: true,
    });
  };
  handleKeyword = event => {
    this.setState({
      keyword: event.target.value,
    });
  };

  handleCustomurl = event => {
    this.setState({
      customUrl: event.target.value,
      cusUrlCheck: true,
    });
  };

  handleClose = reason => {
    if (reason === 'clickaway') {
      return;
    }
    this.setState({
      error: '',
      copied: false,
    });
  };

  handleSubmit = async event => {
    event.preventDefault();
    const api_fetch = process.env.REACT_APP_API_KEY;

    var data;
    var target = this.state.longUrl;
    var customurl = this.state.customUrl;

    if (target === '') {
      this.setState({
        error: "URL can't be empty",
        submitButton: false,
      });
    } else if (/^http(s)?:\/\//.test(target) === false) {
      this.setState({
        longUrl: `http://${target}`,
      });
    } else if (!validUrl.isUri(target)) {
      this.setState({
        error: 'Invalid URL!',
        submitButton: false,
      });
    } else {
      if (this.state.customUrl === '') {
        axios.get(api_fetch).then(res => {
          data = res.data.data;
          console.log(data)
          var link = '';

          var views_count;
          let date_created;
          for (var i = 0; i < data.length; i++) {
            if (data[i].target === this.state.longUrl) {
              link = data[i].link;
              views_count = data[i].visit_count;
              date_created = data[i].created_at;

              break;
            }
          }

          if (link === '') {
            axios
              .post(api_fetch, {
                target,
                domain: 'dsctiet.xyz',
              })
              .then(res => {
                this.setState({
                  shortUrl: res.data.link,
                  submitButton: true,
                  views: res.data.visit_count,
                  date: res.data.created_at,
                });
              });
          } else {
            this.setState({
              shortUrl: link,
              submitButton: true,
              views: views_count,
              date: date_created,
            });
          }
        });
      } else {
        axios.get(api_fetch).then(res => {
          data = res.data.data;

          var flag = 1;
          for (var i = 0; i < data.length; i++) {
            if (data[i].address === this.state.customUrl) {
              this.setState({
                error: 'URL already in use!',
                submitButton: false,
              });
              flag = 0;
              break;
            }
          }
          if (flag === 1) {
            axios
              .post(api_fetch, {
                target,
                domain: 'dsctiet.xyz',
                customurl,
              })
              .then(res => {
                this.setState({
                  shortUrl: res.data.link,
                  views: res.data.visit_count,
                  date: res.data.created_at,
                  submitButton: true,
                });
              });
          }
        });
      }

      // next api call

      axios.get(api_fetch).then(res => {
        data = res.data.data;

        var idd;
        /*
        for (var i = 0; i < data.length; i++) {
          if (data[i].target === this.state.longUrl) {
            idd = data[i].id;
            break;
          }
        }
        */
        const ap = process.env.REACT_APP_API;
        var api = '/api/v2/links/' + idd + ap;

        axios.get(api).then(res => {
          this.setState({
            views_arr: res.data.allTime.views,
          });
        });
      });
    }
  };

  render() {
    const { qrButton } = this.state;
    const { getStats } = this.state;
    const { error } = this.state;
    const { copied } = this.state;
    const { submitButton } = this.state;
    return (
      <Fragment>
        <Container fixed>
          <Grid
            container
            spacing={4}
            style={{
              marginTop: '100px',
            }}
          >
            <Grid item xs={10}>
              <h1>Shorter Links , Less Hassle , More Productivity</h1>

              <em style={{ fontWeight: '100' }}>
                Manage and Personalize your tedious links to short and concise
                ones with this astonishing URL Shortening Service made by the
                Developer Student Clubs powered by Google Developers. Get more
                work done , without any hassle of maintaining those long links,
                and get your links shortened and easy to use with our simple
                URL-Shortener Service.
              </em>
            </Grid>
            <Grid item xs />
          </Grid>
        </Container>
        <Container fixed>
          <Grid container spacing={1} style={{ marginTop: '100px' }}>
            <Grid item xs={2} />
            <Box
              display="flex"
              flexDirection="row"
              alignItems="center"
              alignContent="flex-start"
              flexWrap="wrap"
            >
              <Box flexGrow={7}>
                <TextField
                  label="Enter the URL"
                  style={{
                    width: '100%',
                    background: 'rgba(230, 230, 230, 0.88)',
                  }}
                  required
                  fullWidth
                  variant="filled"
                  value={this.state.longUrl}
                  onChange={this.handleChange}
                ></TextField>
              </Box>
              <Box m={1} flexGrow={4} css={{ maxWidth: 100 }}>
                <TextField
                  select
                  label="Domain"
                  style={{
                    background: 'rgba(230, 230, 230, 0.88)',
                    disableUnderline: true,
                  }}
                  required
                  value={this.state.keyword}
                  onChange={this.handleKeyword}
                  variant="filled"
                >
                  {keywords.map(option => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}{' '}
                </TextField>
              </Box>
              <Box
                m={2}
                flexGrow={2}
                alignContent="flex-end"
                css={{ maxWidth: 150 }}
              >
                <TextField
                  label="Custom Key"
                  value={this.state.customUrl}
                  onChange={this.handleCustomurl}
                  style={{
                    background: 'rgba(230, 230, 230, 0.88)',
                    disableUnderline: true,
                  }}
                  variant="filled"
                ></TextField>
              </Box>
              <Box m={2} flexGrow={3}>
                <MaterialButtonSuccess
                  style={{
                    height: 62,
                    cursor: 'pointer',
                    background: 'rgba(1, 87, 155, 100)',
                  }}
                  onClick={this.handleSubmit}
                ></MaterialButtonSuccess>
              </Box>
            </Box>
          </Grid>
          {error && (
            <Snackbar
              open={error}
              TransitionComponent={Zoom}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'center',
              }}
              autoHideDuration={6000}
              onClose={this.handleClose}
            >
              <Alert
                onClose={this.handleClose}
                severity="warning"
                variant="filled"
              >
                {this.state.error}
              </Alert>
            </Snackbar>
          )}
          {submitButton && (
            <Fade in={submitButton}>
              <Grid
                container
                spacing={3}
                alignItems="center"
                style={{ marginTop: '60px' }}
              >
                <Grid item xs />
                <Grid item xs={4}>
                  <MaterialUnderlineTextbox
                    style={{
                      height: 49,
                      width: 398,
                      position: 'absolute',
                      borderWidth: 1,
                      borderColor: 'rgba(255,255,255,1)',
                      borderStyle: 'solid',
                    }}
                    inputStyle="Short url"
                    value={this.state.shortUrl}
                  />
                  <TextField
                    label="Views"
                    value={this.state.views}
                    style={{
                      position: 'absolute',
                      width: '15%',

                      background: 'rgba(230, 230, 230, 0.88)',
                      disableUnderline: true,
                    }}
                    variant="filled"
                  ></TextField>

                  <TextField
                    label="date created"
                    value={this.state.date}
                    style={{
                      position: 'absolute',
                      width: '15%',
                      marginLeft: 0,
                      background: 'rgba(230, 230, 230, 0.88)',
                      disableUnderline: true,
                    }}
                    variant="filled"
                  ></TextField>
                  <TextField
                    label="Views array"
                    value={this.state.views_arr}
                    style={{
                      position: 'absolute',
                      width: '15%',

                      background: 'rgba(230, 230, 230, 0.88)',
                      disableUnderline: true,
                    }}
                    variant="filled"
                  ></TextField>
                  <CopyToClipboard
                    text={this.state.shortUrl}
                    onChange={this.handleCopy}
                  >
                    <Tooltip
                      title="Copy"
                      TransitionProps={{ timeout: 600 }}
                      onClick={this.handleCopy}
                    >
                      <FileCopyOutlinedIcon
                        fontSize="medium"
                        onClick={this.handleQr}
                        style={{
                          position: 'absolute',
                          elevation: 0,
                          cursor: 'pointer',
                          marginTop: '10px',
                          marginLeft: '360px',
                          color: '#263238',
                          cursorText: 'QR',
                        }}
                      />
                    </Tooltip>
                  </CopyToClipboard>
                  {copied && (
                    <Snackbar
                      open={copied}
                      TransitionComponent={Zoom}
                      anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'center',
                      }}
                      autoHideDuration={6000}
                      onClose={this.handleClose}
                    >
                      <Alert
                        onClose={this.handleClose}
                        severity="info"
                        variant="filled"
                      >
                        Copied to Clipboard !
                      </Alert>
                    </Snackbar>
                  )}

                  <Tooltip title="Get QR" TransitionProps={{ timeout: 600 }}>
                    <CropFreeIcon
                      fontSize="medium"
                      onClick={this.handleQr}
                      style={{
                        position: 'absolute',
                        elevation: 0,
                        cursor: 'pointer',
                        marginTop: '10px',
                        marginLeft: '360px',
                        color: '#263238',
                        cursorText: 'QR',
                      }}
                    />
                  </Tooltip>
                </Grid>

                {qrButton && (
                  <Grid item xs={1}>
                    <Zoom in={qrButton}>
                      <QRCode
                        value={this.state.shortUrl}
                        style={{
                          position: 'absolute',
                        }}
                      />
                    </Zoom>
                  </Grid>
                )}
                {}
                <Grid item xs />
              </Grid>
            </Fade>
          )}

          <Grid container style={{ marginTop: '250px' }} alignItems="center">
            {getStats && (
              <TextField
                label="date created"
                value={this.state.date}
                style={{
                  position: 'absolute',
                  width: '15%',
                  marginLeft: 0,
                  background: 'rgba(230, 230, 230, 0.88)',
                  disableUnderline: true,
                }}
                variant="filled"
              />
            )}
            {getStats && (
              <TextField
                label="Views"
                value={this.state.views}
                style={{
                  position: 'absolute',
                  width: '15%',
                  background: 'rgba(230, 230, 230, 0.88)',
                  disableUnderline: true,
                }}
                variant="filled"
              />
            )}
          </Grid>
        </Container>
      </Fragment>
    );
  }
}

export default HomeScreen;
