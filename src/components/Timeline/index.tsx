import * as React from "react";
import { isCompositeComponent } from "react-dom/test-utils";
import "./styles.css";
import { randomItems } from "./test";

var unitWidth = 60;

interface RespTimeline {
  position_id: number;
  posts: Array<RespPost>;
  links: any;
}
interface RespPost {
  id: number;
  phase_id: number;
  user_id: number;
  position_id: number;
  date: string;
  description: string;
  created_at: string;
  updated_at: string;
  links: any;
}

interface TimelineProps {}

interface TimelineState {
  timelineTranslateX: number;
  timelineWidth: number;
  items: Array<itemType>;
  eventsWrapperRef: React.MutableRefObject<any>;
  isReachPrevLimit: boolean;
  isReachNextLimit: boolean;
  visibleEventIndex: number;
  prevEventIndex: number;
  fillingLineScaleX: number;
}

interface itemType {
  myClass: string;
  dataDate: string;
  title: string;
  subtitle: string;
  desc: string;
  left: number;
}

class Timeline extends React.Component<TimelineProps, TimelineState> {
  constructor(props: TimelineProps) {
    super(props);
    // Don't call this.setState() here!
    let items: Array<itemType> = randomItems.sort(
      (a, b) =>
        this.getParsedDate(a).getTime() - this.getParsedDate(b).getTime()
    );
    let minLapse = this.minLapse(items);
    let timelineWidth = this.getTimelineWidth(items, minLapse, unitWidth);
    items.forEach((item, index, items) => {
      item.left = this.getItemPosition(items[0], item, minLapse, unitWidth);
    });
    let ref = React.createRef();
    this.state = {
      timelineTranslateX: 0,
      timelineWidth: timelineWidth,
      items: items,
      eventsWrapperRef: ref,
      isReachPrevLimit: true,
      isReachNextLimit: false,
      visibleEventIndex: 0,
      prevEventIndex: 0,
      fillingLineScaleX: 0,
    };
  }
  updateByRespTimeline(tl: RespTimeline) {
    let items = new Array<itemType>();
    for (let idx = 0; idx < tl.posts.length; idx++) {
      let p = tl.posts[idx];
      let date = new Date(p.updated_at);
      date.setMonth(idx + 1);
      let month = date.toLocaleString('default', { month: 'long' });
      let day = date.toLocaleString('default', { day: 'numeric' });
      let year = date.getFullYear();
      items.push({
        dataDate: `${day}/${date.getMonth()}/${year}`,
        title: `phase: ${p.phase_id}`,
        desc: p.description || '',
        // desc: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Illum praesentium officia, fugit recusandae ipsa, quia velit nulla adipisci? Consequuntur aspernatur at, eaque hic repellendus sit dicta consequatur quae, ut harum ipsam molestias maxime non nisi reiciendis eligendi! Doloremque quia pariatur harum ea amet quibusdam quisquam, quae, temporibus dolores porro doloribus.',
        left: 0,
        subtitle: `${month} ${day}, ${year}`,
        myClass: idx == 0 ? 'selected' : '',
      });
    }
    items.forEach((item, index, items) => {
      item.left = this.getItemPosition(
        items[0],
        item,
        this.minLapse(items),
        unitWidth
      );
    });
    let minLapse = this.minLapse(items);
    let timelineWidth = this.getTimelineWidth(items, minLapse, unitWidth);
    this.setState({
      timelineTranslateX: 0,
      items: items,
      timelineWidth: timelineWidth,
    });
    this.updateFilling(0);
    return items;
  }

  componentDidMount() {
    this.updateFilling(0);
    fetch('http://54.84.3.38:3000/api/users/1/timelines')
      .then((resp) => {
        return resp.json();
      })
      .then((result) => {
        result.timelines.forEach(
          (el: RespTimeline) => this.updateByRespTimeline(el)
          // this.setState({ items: randomItems })
        );
      })
      .catch((err) => {
        console.log(err);
      });
  }
  render() {
    return (
      <section className="cd-horizontal-timeline">
        <div className="events-content">
          <ol>
            {this.state.items.map((item: itemType, index: number) => {
              return (
                <li
                  key={index}
                  className={item.myClass}
                  data-date={item.dataDate}
                  onAnimationEnd={() => {
                    this.cleanEnterAndLeaveClass();
                  }}
                >
                  <h2>{item.title}</h2>
                  <em>{item.subtitle}</em>
                  <p> {item.desc}</p>
                </li>
              );
            })}
          </ol>
        </div>

        <div className="timeline">
          <div className="events-wrapper" ref={this.state.eventsWrapperRef}>
            <div
              className="events"
              style={{
                width: this.state.timelineWidth,
                transform: `translateX(${this.state.timelineTranslateX}px)`,
              }}
            >
              <ol>
                {this.state.items.map((item: itemType, index: number) => {
                  let leavingEventIndex = this.state.visibleEventIndex;
                  return (
                    <li key={index}>
                      <a
                        href="#0"
                        data-date={item.dataDate}
                        className={item.myClass}
                        style={{ left: item.left }}
                        onClick={() => {
                          this.handleClickOnEvent(leavingEventIndex, index);
                        }}
                      >
                        {this.getCompactDateStr(this.getParsedDate(item))}
                      </a>
                    </li>
                  );
                })}
              </ol>

              <span
                className="filling-line"
                aria-hidden="true"
                style={{ transform: `scaleX(${this.state.fillingLineScaleX})` }}
              ></span>
            </div>
          </div>

          <ul className="cd-timeline-navigation">
            <li>
              <a
                href="#0"
                className={
                  'prev' + (this.state.isReachPrevLimit ? ' inactive' : '')
                }
                onClick={() => this.handleClickOnPrev()}
              >
                Prev
              </a>
            </li>
            <li>
              <a
                href="#0"
                className={
                  'next' + (this.state.isReachNextLimit ? ' inactive' : '')
                }
                onClick={() => this.handleClickOnNext()}
              >
                Next
              </a>
            </li>
          </ul>
        </div>
      </section>
    );
  }
  //based on http://stackoverflow.com/questions/542938/how-do-i-get-the-number-of-days-between-two-dates-in-javascript
  getParsedDate(item: itemType) {
    let date, time;
    let singleDate = item.dataDate,
      dateComp = singleDate.split('T');
    if (dateComp.length > 1) {
      //both DD/MM/YEAR and time are provided
      date = dateComp[0].split('/');
      time = dateComp[1].split(':');
    } else if (dateComp[0].indexOf(':') >= 0) {
      //only time is provide
      date = ['2000', '0', '0'];
      time = dateComp[0].split(':');
    } else {
      //only DD/MM/YEAR
      date = dateComp[0].split('/');
      time = ['0', '0'];
    }
    let newDate = new Date(
      Number(date[2]),
      Number(date[1]) - 1,
      Number(date[0]),
      Number(time[0]),
      Number(time[1])
    );
    return newDate;
  }

  daydiff(first: Date, second: Date) {
    let oneDay = 24 * 3600 * 1000; // milliseconds;
    return Math.round((second.getTime() - first.getTime()) / oneDay);
  }

  minLapse(items: Array<itemType>) {
    //determine the minimum distance among events
    let dateDistances = [];
    let dates: Array<Date> = items.map(this.getParsedDate);

    for (let i = 1; i < dates.length; i++) {
      var distance = this.daydiff(dates[i - 1], dates[i]);
      dateDistances.push(distance);
    }
    return Math.min.apply(null, dateDistances);
  }

  getItemPosition(
    firstItem: itemType,
    currItem: itemType,
    minLapse: number,
    unitWidth: number
  ) {
    let distance = this.daydiff(
      this.getParsedDate(firstItem),
      this.getParsedDate(currItem)
    );
    let distanceNorm = Math.round(distance / minLapse) + 2;
    return distanceNorm * unitWidth;
  }

  getTimelineWidth(
    items: Array<itemType>,
    minLapse: number,
    unitWidth: number
  ) {
    items.sort(
      (a, b) =>
        this.getParsedDate(a).getTime() - this.getParsedDate(b).getTime()
    );

    var timeSpan = this.daydiff(
        this.getParsedDate(items[0]),
        this.getParsedDate(items[items.length - 1])
      ),
      timeSpanNorm = timeSpan / minLapse,
      timeSpanNorm = Math.round(timeSpanNorm) + 4,
      totalWidth = timeSpanNorm * unitWidth;
    console.log(timeSpan, minLapse, timeSpanNorm, totalWidth);

    return totalWidth;
  }

  getCompactDateStr(date: Date) {
    let month = date.toLocaleString('default', { month: 'short' });
    let day = date.toLocaleString('default', { day: 'numeric' });
    return `${day} ${month}`;
  }

  handleClickOnPrev() {
    let { timelineTranslateX, timelineWidth } = this.state;
    let visibleWidth = this.state.eventsWrapperRef.current.clientWidth;
    let value = timelineTranslateX + visibleWidth - unitWidth;
    let negLimit = visibleWidth - timelineWidth;
    this.updateTimelineTranslateX(value, negLimit);
  }

  handleClickOnNext() {
    let { timelineTranslateX, timelineWidth } = this.state;
    let visibleWidth = this.state.eventsWrapperRef.current.clientWidth;
    let value = timelineTranslateX - visibleWidth + unitWidth;
    let negLimit = visibleWidth - timelineWidth;
    this.updateTimelineTranslateX(value, negLimit);
  }

  updateTimelineTranslateX(value: number, negLimit: number) {
    value = Math.min(value, 0); //only negative translate value
    value = Math.max(value, negLimit); //do not translate more than timeline width
    this.setState({ timelineTranslateX: value });
    value <= negLimit
      ? this.setState({ isReachNextLimit: true })
      : this.setState({ isReachNextLimit: false });
    value >= 0
      ? this.setState({ isReachPrevLimit: true })
      : this.setState({ isReachPrevLimit: false });
  }

  handleClickOnEvent(leavingEventIndex: number, enteringEventIndex: number) {
    this.updateVisibleEventContent(leavingEventIndex, enteringEventIndex);
    this.updateFilling(enteringEventIndex);
  }

  cleanEnterAndLeaveClass() {
    let { items, prevEventIndex, visibleEventIndex } = this.state;
    items[prevEventIndex].myClass = items[prevEventIndex].myClass.replace(
      /leave-left|leave-right/gi,
      ''
    );

    items[visibleEventIndex].myClass = items[visibleEventIndex].myClass.replace(
      /enter-left|enter-right/gi,
      ''
    );

    this.setState({ items: items });
  }

  updateVisibleEventContent(
    leavingEventIndex: number,
    enteringEventIndex: number
  ) {
    let { items } = this.state;
    let classEnetering, classLeaving;
    if (enteringEventIndex > leavingEventIndex) {
      classEnetering = 'selected enter-right';
      classLeaving = 'leave-left';
    } else {
      classEnetering = 'selected enter-left';
      classLeaving = 'leave-right';
    }
    items[leavingEventIndex].myClass = classLeaving;
    items[enteringEventIndex].myClass = classEnetering;
    this.setState({
      items: items,
      visibleEventIndex: enteringEventIndex,
      prevEventIndex: leavingEventIndex,
    });
  }
  updateFilling(index: number) {
    // change .filling-line length according to the selected event
    let totWidth = this.state.timelineWidth;
    let eventLeft = this.state.items[index].left;
    let scaleX = eventLeft / totWidth;
    this.setState({ fillingLineScaleX: scaleX });
  }
}

export default Timeline;
