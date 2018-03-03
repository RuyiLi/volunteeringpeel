// Library Imports
import axios, { AxiosError } from 'axios';
import * as Promise from 'bluebird';
import update, { Query } from 'immutability-helper'; // tslint:disable-line:import-name
import * as _ from 'lodash';
import * as moment from 'moment';
import * as React from 'react';
import 'react-widgets/dist/css/react-widgets.css';
import * as DateTimePicker from 'react-widgets/lib/DateTimePicker';
import { Button, Form, Icon, Menu, Segment } from 'semantic-ui-react';

interface EditEventProps {
  addMessage: (message: Message) => any;
  cancel: () => void;
  loading: (status: boolean) => any;
  originalEvent: VPEvent;
  refresh: () => void;
}

interface EditEventState {
  name: string;
  description: string;
  address: string;
  transport: string;
  active: boolean;
  shifts: Shift[];
  selectedShiftId: number;
}

export default class EditEvent extends React.Component<EditEventProps, EditEventState> {
  constructor(props: EditEventProps) {
    super(props);

    this.state = {
      name: props.originalEvent.name,
      description: props.originalEvent.description,
      address: props.originalEvent.address,
      transport: props.originalEvent.transport,
      active: props.originalEvent.active,
      shifts: props.originalEvent.shifts,
      selectedShiftId: null,
    };
  }

  public componentWillReceiveProps(nextProps: EditEventProps) {
    if (!_.isEqual(this.props.originalEvent, nextProps.originalEvent)) {
      this.setState({
        name: nextProps.originalEvent.name,
        description: nextProps.originalEvent.description,
        address: nextProps.originalEvent.address,
        transport: nextProps.originalEvent.transport,
        active: nextProps.originalEvent.active,
        shifts: nextProps.originalEvent.shifts,
        selectedShiftId: null,
      });
    }
  }

  public handleChange = (e: React.FormEvent<any>, { name, value, checked }: any) => {
    this.setState({ [name]: value || checked });
  };

  public handleShiftChange = (e: React.FormEvent<any>, { name, value, checked }: any) => {
    const selectedShiftIndex = _.findIndex(this.state.shifts, [
      'shift_id',
      this.state.selectedShiftId,
    ]);
    let newState: Query<any> = {
      [name]: {
        $set: value,
      },
    };
    // add/remove meal from meals array
    if (/meals/.test(name)) {
      const meals = checked
        ? this.state.shifts[selectedShiftIndex].meals.concat([name])
        : _.filter(this.state.shifts[selectedShiftIndex].meals, x => x !== name);
      newState = {
        meals: {
          $set: meals,
        },
      };
    }
    // save date as a string
    if (/date/.test(name)) {
      newState = {
        shifts: {
          [selectedShiftIndex]: {
            [name]: {
              $set: (value as Date).toISOString(),
            },
          },
        },
      };
    }
    this.setState(update(this.state, { shifts: { [selectedShiftIndex]: newState } }));
  };

  public handleSubmit = () => {
    const { name, description, address, transport, active } = this.state;
    Promise.resolve(this.props.loading(true))
      .then(() =>
        axios.post(
          `/api/events/${this.props.originalEvent.event_id}`,
          { name, description, address, transport, active },
          {
            headers: { Authorization: `Bearer ${localStorage.getItem('id_token')}` },
          },
        ),
      )
      .then(res => {
        this.props.addMessage({ message: res.data.data, severity: 'positive' });
        this.props.refresh();
      })
      .catch((error: AxiosError) => {
        this.props.addMessage({
          message: error.response.data.error,
          more: error.response.data.details,
          severity: 'negative',
        });
      })
      .finally(() => this.props.loading(false));
  };

  public handleDelete = () => {
    Promise.resolve(this.props.loading(true))
      .then(() =>
        axios.delete(`/api/events/${this.props.originalEvent.event_id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('id_token')}` },
        }),
      )
      .then(res => {
        this.props.addMessage({ message: res.data.data, severity: 'positive' });
        this.props.refresh();
        // deselect event (cause it's gone)
        this.props.cancel();
      })
      .catch((error: AxiosError) => {
        this.props.addMessage({
          message: error.response.data.error,
          more: error.response.data.details,
          severity: 'negative',
        });
      })
      .finally(() => this.props.loading(false));
  };

  public render() {
    const { name, description, address, transport, active, shifts, selectedShiftId } = this.state;
    const selectedShift = _.find(shifts, ['shift_id', selectedShiftId]);

    return (
      <Form onSubmit={this.handleSubmit}>
        <Form.Input
          fluid
          label="Name"
          name="name"
          value={name}
          placeholder="A Super Cool Event"
          onChange={this.handleChange}
          required
        />
        <Form.Checkbox
          label="Show event on Events page?"
          name="active"
          checked={active}
          onChange={this.handleChange}
        />
        <Form.TextArea
          label="Description"
          name="description"
          value={description}
          placeholder="This is gonna be super cool. Sign up please my life depends on it."
          onChange={this.handleChange}
          required
        />
        <Form.Group widths="equal">
          <Form.Input
            fluid
            label="Address"
            name="address"
            value={address}
            placeholder="1234 Sesame Street"
            onChange={this.handleChange}
            required
          />
          <Form.Input
            fluid
            label="Transportation provided from"
            name="transport"
            value={transport}
            placeholder="None provided"
            onChange={this.handleChange}
          />
        </Form.Group>
        <Menu attached="top" tabular>
          {_.map(shifts, shift => (
            <Menu.Item
              name={`shift-${shift.shift_num}`}
              key={shift.shift_num}
              active={shift.shift_id === selectedShiftId}
              onClick={() => this.setState({ selectedShiftId: shift.shift_id })}
            />
          ))}
          <Menu.Menu position="right">
            <Menu.Item name="shift-add" content="+" />
          </Menu.Menu>
        </Menu>
        <Segment attached="bottom">
          {_.isFinite(selectedShiftId) ? (
            <>
              <Form.Group widths="equal">
                <Form.Field
                  fluid
                  label="Start"
                  control={DateTimePicker}
                  name="start_time"
                  value={new Date(selectedShift.start_time)}
                  onChange={(value: Date) =>
                    this.handleShiftChange(null, { value, name: 'start_time' })
                  }
                  required
                />
                <Form.Field
                  fluid
                  label="End"
                  control={DateTimePicker}
                  name="end_time"
                  value={new Date(selectedShift.end_time)}
                  onChange={(value: Date) =>
                    this.handleShiftChange(null, { value, name: 'end_time' })
                  }
                  required
                />
              </Form.Group>
              <Form.Input
                inline
                label="Spots"
                name="max_spots"
                value={selectedShift.max_spots}
                type="number"
                placeholder="420"
                required
                onChange={this.handleShiftChange}
              />
              <Form.Group inline>
                <label>Food provided:</label>
                <Form.Checkbox
                  label="Breakfast"
                  name="meals-breakfast"
                  checked={_.includes(selectedShift.meals, 'breakfast')}
                  onChange={this.handleShiftChange}
                />
                <Form.Checkbox
                  label="Lunch"
                  name="meals-lunch"
                  checked={_.includes(selectedShift.meals, 'lunch')}
                  onChange={this.handleShiftChange}
                />
                <Form.Checkbox
                  label="Dinner"
                  name="meals-dinner"
                  checked={_.includes(selectedShift.meals, 'dinner')}
                  onChange={this.handleShiftChange}
                />
                <Form.Checkbox
                  label="Snack"
                  name="meals-snack"
                  checked={_.includes(selectedShift.meals, 'snack')}
                  onChange={this.handleShiftChange}
                />
              </Form.Group>
              <Form.TextArea
                label="Notes"
                name="notes"
                value={selectedShift.notes}
                placeholder="Shift specific notes. Please, please sign up; my resumé depends on it."
                required
                onChange={this.handleShiftChange}
              />
            </>
          ) : (
            <p>Please select a shift to edit, or add a shift by clicking the plus button.</p>
          )}
        </Segment>
        <Form.Group>
          <Button.Group fluid>
            <Button type="submit" animated="fade" primary>
              <Button.Content hidden>Save</Button.Content>
              <Button.Content visible>
                <Icon name="save" />
              </Button.Content>
            </Button>
            <Button onClick={this.handleDelete} animated="fade" negative>
              <Button.Content hidden>Delete</Button.Content>
              <Button.Content visible>
                <Icon name="trash" />
              </Button.Content>
            </Button>
            <Button onClick={this.props.cancel} animated="fade">
              <Button.Content hidden>Cancel</Button.Content>
              <Button.Content visible>
                <Icon name="delete" />
              </Button.Content>
            </Button>
          </Button.Group>
        </Form.Group>
      </Form>
    );
  }
}
