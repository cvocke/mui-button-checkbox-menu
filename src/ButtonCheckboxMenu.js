import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import withStyles from "@material-ui/core/styles/withStyles";
import Button from "@material-ui/core/Button";
import Checkbox from "@material-ui/core/Checkbox";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import FormControl from "@material-ui/core/FormControl";
import Grow from "@material-ui/core/Grow";
import ListItemText from "@material-ui/core/ListItemText";
import MenuList from "@material-ui/core/MenuList";
import MenuItem from "@material-ui/core/MenuItem";
import Paper from "@material-ui/core/Paper";
import Popper from "@material-ui/core/Popper";

const styles = {
  paper: {
    marginTop: 5,
    overflow: "auto",
    zIndex: 1000
  },
  menuList: {
    overflow: "auto",
    marginBottom: 36
  },
  menuListDense: {
    marginBottom: 24
  },
  allOrNone: {
    width: "50%",
    fontSize: "1rem",
    borderRadius: 0,
    padding: "8px 16px",
    minHeight: "36px"
  },
  allOrNoneDense: {
    fontSize: "0.8rem",
    padding: 0,
    minHeight: "24px"
  },
  allOrNoneDivider: {
    backgroundColor: "#e0e0e0",
    width: "1px",
    position: "absolute",
    height: "100%"
  },
  allOrNoneWrapper: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    background: "white",
    borderTop: "1px solid #e0e0e0"
  },
  menuItemDense: { padding: "0 2px 0 16px" },
  checkboxDense: { width: 12 }
};

class CheckboxMenu extends React.Component {
  static defaultProps = {
    onToggle: () => { },
    onChange: () => { },
    checkboxColor: "secondary",
    disablePortal: false,
    maxHeight: 324,
    placement: "bottom-start",
    defaultLabel: "Choose",
    allText: "All",
    noneText: "None"
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

  /** onClickAway handler for ClickAwayListener.
   * - Only update internal state if open is not controlled
   * - Skip clicks of the button (anchorEl). toggle() will handle those
   * - Skip clicks of the select all/none div at bottom of dropdown
   * - Only update internal state if open is not controlled
   */
  close = event => {
    if (
      this.anchorEl.contains(event.target) ||
      this.selectAllOrNone.contains(event.target)
    ) {
      return;
    }
    if (this.isOpenControlled) {
      this.props.onToggle(false);
    } else {
      this.setState({ open: false }, () => this.props.onToggle(false));
    }
  };

  // onClick handler for menu options
  // Only update internal state if selected is not controlled
  handleSelect = (event, allOrNone) => {
    const newSelection = event.currentTarget.getAttribute("value");

    const updateSelection = currentSelection => {
      if (allOrNone !== undefined) {
        if (allOrNone === "none") {
          return [];
        } else {
          return [
            ...new Set(
              this.props.options.map(option => {
                return typeof option === "object" ? option.value : option;
              })
            )
          ];
        }
      }

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
    const {
      open,
      options,
      selected,
      classes,
      style,
      children,
      dense,
      defaultLabel,
      placement,
      disablePortal,
      maxHeight,
      checkboxColor,
      allText,
      noneText
    } = this.props;

    return (
      <div style={style}>
        <FormControl>
          {children ? (
            <div
              ref={node => {
                this.anchorEl = node;
              }}
            >
              {React.cloneElement(children, {
                onClick: this.toggle
              })}
            </div>
          ) : (
              <Button
                onClick={this.toggle}
                variant="raised"
                buttonRef={node => {
                  this.anchorEl = node;
                }}
              >
                {defaultLabel}
              </Button>
            )}
          <Popper
            open={this.isOpenControlled ? open : this.state.open}
            anchorEl={this.anchorEl}
            placement={placement}
            transition
            disablePortal={disablePortal}
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
                    // marginTop: disablePortal
                    //   ? this.anchorEl.clientHeight + 5
                    //   : 5,
                    maxHeight: maxHeight
                  }}
                  className={classes.paper}
                >
                  <ClickAwayListener onClickAway={this.close}>
                    <div
                      style={{
                        maxHeight: maxHeight - (dense ? 24 : 36)
                      }}
                      className={classNames(classes.menuList, {
                        [classes.menuListDense]: dense
                      })}
                    >
                      <MenuList dense={dense} disablePadding>
                        {options.map((name, index) => (
                          <MenuItem
                            key={name + index}
                            value={typeof name === "object" ? name.value : name}
                            onClick={this.handleSelect}
                            className={dense && classes.menuItemDense}
                          >
                            <Checkbox
                              color={checkboxColor}
                              checked={
                                this.isSelectedControlled
                                  ? selected.indexOf(
                                    typeof name === "object"
                                      ? name.value.toString()
                                      : name.toString()
                                  ) > -1
                                  : this.state.selected.indexOf(
                                    typeof name === "object"
                                      ? name.value.toString()
                                      : name.toString()
                                  ) > -1
                              }
                              className={dense && classes.checkboxDense}
                            />
                            <ListItemText
                              primary={
                                typeof name === "object" ? name.text : name
                              }
                            />
                          </MenuItem>
                        ))}
                      </MenuList>
                    </div>
                    <div
                      className={classes.allOrNoneWrapper}
                      ref={node => {
                        this.selectAllOrNone = node;
                      }}
                    >
                      <Button
                        className={classNames(classes.allOrNone, {
                          [classes.allOrNoneDense]: dense
                        })}
                        batchselect={"all"}
                        onClick={e => this.handleSelect(e, "all")}
                      >
                        {allText}
                      </Button>
                      <span className={classes.allOrNoneDivider} />
                      <Button
                        className={classNames(classes.allOrNone, {
                          [classes.allOrNoneDense]: dense
                        })}
                        onClick={e => this.handleSelect(e, "none")}
                      >
                        {noneText}
                      </Button>
                    </div>
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

CheckboxMenu.propTypes = {
  open: PropTypes.bool,
  options: PropTypes.arrayOf(
    PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.object])
  ).isRequired,
  selected: PropTypes.arrayOf(
    PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.object])
  ),
  onToggle: PropTypes.func,
  onChange: PropTypes.func,
  classes: PropTypes.object,
  style: PropTypes.object,
  children: PropTypes.object,
  dense: PropTypes.bool,
  defaultLabel: PropTypes.string,
  placement: PropTypes.string,
  disablePortal: PropTypes.bool,
  maxHeight: PropTypes.number,
  checkboxColor: PropTypes.string,
  allText: PropTypes.string,
  noneText: PropTypes.string
};

export default withStyles(styles)(CheckboxMenu);
