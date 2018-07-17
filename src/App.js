import React, { Component } from "react";
import ButtonCheckboxMenu from "./ButtonCheckboxMenu";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";
import names from "starwars-names";

class App extends Component {
  state = {
    teamMates: [],
    selected: [],
    open: false,
    dense: false
  };

  selectRandom = options =>
    options.filter((option, index) => Math.random() > 0.6);

  componentDidMount() {
    const teamSize = Math.floor(Math.random() * 16) + 5;
    const teamMates = names.random(teamSize);
    const selected = this.selectRandom(teamMates);
    this.setState({ teamMates, selected });
  }

  handleChange = value => {
    this.setState({ selected: value });
  };

  toggleDense = () => {
    this.setState({ dense: !this.state.dense });
  };

  render() {
    return (
      <div>
        <div style={{ height: 100, overflow: "hidden" }}>
          Selection value: {JSON.stringify(this.state.selected)}
        </div>
        <div>Dense mode: {JSON.stringify(this.state.dense)}</div>
        <FormControlLabel
          control={<Switch />}
          label="Dense mode"
          onChange={this.toggleDense}
        />
        <ButtonCheckboxMenu
          options={this.state.teamMates}
          selected={this.state.selected}
          onChange={this.handleChange}
          dense={this.state.dense}
          disablePortal
          open={this.state.open}
          onToggle={value => this.setState({ open: value })}
        />
      </div>
    );
  }
}

export default App;
