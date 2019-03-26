import React, { Component } from "react";
import CheckboxMenu from "./CheckboxMenu";
import withStyles from "@material-ui/core/styles/withStyles";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";
import names from "starwars-names";

const styles = {
  divButton: {
    padding: 20,
    background: "skyblue",
    borderRadius: 30,
    fontFamily: "courier",
    "&:hover": {
      cursor: "pointer",
      background: "grey"
    }
  }
};

class App extends Component {
  state = {
    teamMates: [],
    selected: [],
    open: false,
    dense: false
  };

  selectRandom = options =>
    options.filter((option, index) => Math.random() > Math.random());

  componentDidMount() {
    const objectMode = true;
    const teamSize = Math.floor(Math.random() * 56) + 5;
    let teamMates = names.random(teamSize);
    if (objectMode) {
      teamMates = teamMates.map(teamMate => {
        return {
          text: teamMate,
          value: teamMate.replace(/[^a-z0-9]/gi, "").toLowerCase()
        };
      });
    }
    let selected = this.selectRandom(teamMates);
    if (objectMode) {
      selected = selected.map(item => item.value);
    }
    this.setState({ teamMates, selected });
  }

  handleToggle = value => this.setState({ open: value });

  handleChange = value => {
    this.setState({ selected: value });
  };

  toggleDense = () => {
    this.setState({ dense: !this.state.dense });
  };

  render() {
    return (
      <div>
        <div style={{ height: 200 }}>
          <div>
            <FormControlLabel
              control={<Switch />}
              label="Dense mode"
              onChange={this.toggleDense}
            />
          </div>
          <div style={{ display: "flex" }}>
            <div style={{ width: "30%" }}>
              <CheckboxMenu
                options={this.state.teamMates}
                selected={this.state.selected}
                onChange={this.handleChange}
                dense={this.state.dense}
                // disablePortal
                open={this.state.open}
                onToggle={this.handleToggle}
              >
                <div className={this.props.classes.divButton}>custom</div>
              </CheckboxMenu>
            </div>
            <div>
              <CheckboxMenu
                options={this.state.teamMates}
                onChange={this.handleChange}
                dense={this.state.dense}
                disablePortal
                defaultLabel="DEFAULT"
              />
            </div>
          </div>
        </div>
        <div>
          <div>{`#teamMates: ${this.state.teamMates.length}. #selected ${
            this.state.selected.length
            }`}</div>
          <div style={{ height: 100, overflow: "hidden" }}>
            Selection value: {JSON.stringify(this.state.selected, null, 4)}
          </div>
          <div>Dense mode: {JSON.stringify(this.state.dense)}</div>
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(App);
