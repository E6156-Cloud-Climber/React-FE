import * as React from "react";
import { isCompositeComponent } from "react-dom/test-utils";
import "./styles.css";
import { randomItems } from "./test";

var unitWidth = 60;

interface RespUserTimeline {
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

interface RespIdName {
  id: number;
  name: string;
}

interface RespPosition {
  id: number;
  company_id: number;
  company: RespIdName;
  name: string;
  position_type: string;
  active: boolean;
  year: number;
  link: string;
}

interface RespStatStr {
  min: string;
  max: string;
  mid: string;
}

interface RespStatNum {
  min: number;
  max: number;
  mid: number;
}

interface RespStatPhase {
  phase_id: number;
  phase: RespIdName;
  total: number;
  pass_cnt: number;
  pass_rate: number;
  date: RespStatStr;
  duration: RespStatNum;
}

interface RespPositionTimeline {
  position: RespPosition;
  phases: Array<RespStatPhase>;
}

interface TimelineProps { }

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
  title: string;
}

interface itemType {
  myClass: string;
  dataDate: string;
  title: string;
  subtitles: Array<string>;
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
      title: 'Your Timeline'
    };
  }
  updateByRespTimeline(tl_user: RespUserTimeline, tl_pos: RespPositionTimeline) {
    let items = new Array<itemType>();
    for (let idx = 0; idx < tl_pos.phases.length; idx++) {
      let phase = tl_pos.phases[idx];
      let post = idx < tl_user.posts.length ? tl_user.posts[idx] : null;
      let date = new Date(post ? post.date : phase.date.mid);
      // date.setMonth(idx + 1);
      let month = date.toLocaleString('default', { month: 'long' });
      let day = date.toLocaleString('default', { day: 'numeric' });
      let year = date.getFullYear();
      let formatDate = function (date: string) {
        return new Date(date).toLocaleDateString('default', { year: 'numeric', month: 'short', day: 'numeric' })
      }
      items.push({
        dataDate: `${day}/${date.getMonth()}/${year}`,
        title: `Phase: ${phase.phase.name} ${!post ? '(Expected)' : ''}`,
        desc: post ? post.description || 'No description' : 'No description',
        // desc: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Illum praesentium officia, fugit recusandae ipsa, quia velit nulla adipisci? Consequuntur aspernatur at, eaque hic repellendus sit dicta consequatur quae, ut harum ipsam molestias maxime non nisi reiciendis eligendi! Doloremque quia pariatur harum ea amet quibusdam quisquam, quae, temporibus dolores porro doloribus.',
        left: 0,
        subtitles: [
          `pass rate: ${phase.pass_cnt || 0}/${phase.total || 0} (${(phase.pass_rate || 0) * 100}%) `,
          `From ${formatDate(phase.date.min)} to ${formatDate(phase.date.max)} (median ${formatDate(phase.date.mid)})`,
        ].concat(phase.duration ? [`Wait ${phase.duration.min} to ${phase.duration.max} (median ${phase.duration.mid}) days to the next phase`] : []),
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
      title: `Your timeline for ${tl_pos.position.name} at ${tl_pos.position.company.name}`
    });
    this.updateFilling(0);
    return items;
  }

  componentDidMount() {
    this.updateFilling(0);
    fetch('http://localhost:3003/api/users/1/timelines')
      .then((resp) => {
        return resp.json();
      })
      .then((result) => {
        // result.timelines.forEach(
        //   (el: RespTimeline) => this.updateByRespTimeline(el)
        //   // this.setState({ items: randomItems })
        // );
        let tl_user = result.timelines[0];
        fetch(`http://localhost:3005/api/composite/positions/${tl_user.position_id}/timeline`)
          .then((resp) => {
            return resp.json();
          })
          .then((tl_pos) => {
            // result.timelines.forEach(
            //   (el: RespTimeline) => this.updateByRespTimeline(el)
            //   // this.setState({ items: randomItems })
            // );
            this.updateByRespTimeline(tl_user, tl_pos);
          })
          .catch((err) => {
            console.log(err);
          });
      })
      .catch((err) => {
        console.log(err);
      });
  }
  render() {
    return (
      <section className="cd-horizontal-timeline">
        <h5 style={{ textAlign: 'center' }}>{this.state.title}</h5>
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
                  {item.subtitles.map((subtitle: string) => {
                    return (
                      <em>{subtitle}</em>
                    )
                  })}
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
      </section >
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
