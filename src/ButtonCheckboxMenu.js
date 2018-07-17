import React from "react";
import FormControl from "@material-ui/core/FormControl";
import Checkbox from "@material-ui/core/Checkbox";
import ListItemText from "@material-ui/core/ListItemText";
import MenuList from "@material-ui/core/MenuList";
import MenuItem from "@material-ui/core/MenuItem";
import Button from "@material-ui/core/Button";
import Popper from "@material-ui/core/Popper";
import Grow from "@material-ui/core/Grow";
import Paper from "@material-ui/core/Paper";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";

/** TO DO
 * - Add Select all/none button to footer for dropdown
 * - Add support for Array OR Collection of Objects
 * - Add single select option
 */

class ButtonCheckboxMenu extends React.Component {
  static defaultProps = {
    onToggle: () => {},
    onChange: () => {},
    disablePortal: false,
    placement: "bottom-start"
  };

  state = {
    open: false,
    selected: []
  };

  // check if open or selected props are controlled
  isOpenControlled = this.props.open !== undefined;
  isSelectedControlled = this.props.selected !== undefined;

  // onClick handler for button.
  // Only update internal state if open is not controlled
  toggle = event => {
    if (this.isOpenControlled) {
      this.props.onToggle(!this.props.open);
    } else {
      this.setState(
        ({ open }) => ({ open: !open }),
        () => this.props.onToggle(this.state.open)
      );
    }
  };

  // onClickAway handler for ClickAwayListener.
  // Only update internal state if open is not controlled
  // Skip clicks of the button (anchorEl). toggle() will handle those
  close = event => {
    if (this.anchorEl.contains(event.target)) {
      return;
    }
    if (this.isOpenControlled) {
      this.props.onToggle(false);
    } else {
      this.setState({ open: false }, () => this.props.onToggle(false));
    }
  };

  // onClick handler for menu options. Only update internal state if selected is not controlled
  handleSelect = event => {
    const newSelection = event.currentTarget.getAttribute("value");

    const updateSelection = currentSelection => {
      let update = [...currentSelection];
      const newSelectionIndex = update.indexOf(newSelection);
      newSelectionIndex < 0
        ? update.push(newSelection)
        : update.splice(newSelectionIndex, 1);
      return update;
    };

    if (this.isSelectedControlled) {
      this.props.onChange(updateSelection(this.props.selected));
    } else {
      this.setState(
        ({ selected }) => {
          const updated = updateSelection(selected);
          return { selected: updated };
        },
        () => this.props.onChange(this.state.selected)
      );
    }
  };

  render() {
    return (
      <div>
        <FormControl>
          <Button
            id="test"
            onClick={this.toggle}
            variant="raised"
            buttonRef={node => {
              this.anchorEl = node;
            }}
          >
            Choose
          </Button>
          <Popper
            open={this.isOpenControlled ? this.props.open : this.state.open}
            anchorEl={this.anchorEl}
            placement={this.props.placement}
            transition
            disablePortal={this.props.disablePortal}
          >
            {({ TransitionProps, placement }) => (
              <Grow
                {...TransitionProps}
                style={{
                  transformOrigin: "center top"
                }}
              >
                <Paper
                  style={{
                    marginTop: this.props.disablePortal ? 40 : 5,
                    maxHeight: this.props.maxHeight
                      ? this.props.maxHeight
                      : 300,
                    overflow: "auto",
                    zIndex: 1000
                  }}
                >
                  <ClickAwayListener onClickAway={this.close}>
                    <MenuList dense={this.props.dense}>
                      {this.props.options.map((name, index) => (
                        <MenuItem
                          key={name + index}
                          value={name}
                          onClick={this.handleSelect}
                          style={
                            this.props.dense ? { padding: "0 2px 0 16px" } : {}
                          }
                        >
                          <Checkbox
                            color={
                              this.props.checkboxColor
                                ? this.props.checkboxColor
                                : "secondary"
                            }
                            checked={
                              this.isSelectedControlled
                                ? this.props.selected.indexOf(name.toString()) >
                                  -1
                                : this.state.selected.indexOf(name.toString()) >
                                  -1
                            }
                            style={this.props.dense ? { width: 12 } : {}}
                          />
                          <ListItemText primary={name} />
                        </MenuItem>
                      ))}
                    </MenuList>
                  </ClickAwayListener>
                </Paper>
              </Grow>
            )}
          </Popper>
        </FormControl>
      </div>
    );
  }
}

export default ButtonCheckboxMenu;
