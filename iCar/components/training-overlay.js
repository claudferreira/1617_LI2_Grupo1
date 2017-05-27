import { Component } from 'react'
import { Icon } from 'semantic-ui-react'

export default class TrainingOverlay extends Component {
  render () {
    const { percentage } = this.props

    const dashOffset = Math.max(0, 1260 - (percentage * 1260 / 100))

    return (
      <div className="container">
        <Icon name="checkmark" size="huge" className={percentage >= 100 ? 'visible' : ''} />

        <svg width="800" height="600">
          <defs>
            <mask id="mask">
              <rect y="0" width="800" height="600" fill="white" />
              <circle cx="400" cy="300" r="175" fill="black" />
            </mask>
          </defs>

          <rect fill="black" width="800" height="600" mask={percentage >= 100 ? null : 'url(#mask)'} fill="rgb(46, 52, 69)" fillOpacity=".9" />

          <circle
            cx="400"
            cy="300"
            r="175"
            fill="transparent"
            strokeDashoffset={dashOffset}
            transform="rotate(-90 400 300)"
          />
        </svg>

        <style jsx>{`
          .container {
            left: 0;
            position: absolute;
            top: 0;
          }

          .container :global(.icon) {
            left: 50%;
            opacity: 0;
            position: absolute;
            top: 50%;
            transform: translate(-50%, -50%) scale(0);
            color: #1cb5ac;
            transition: all .15s cubic-bezier(.175, .885, .320, 1.275);
          }

          .container :global(.icon.visible) {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
          }

          svg > circle {
            transition: all .1s ease-in-out;
            stroke: #1cb5ac;
            stroke-width: 5;
            stroke-dasharray: 1260;
            stroke-linecap: round;
          }
        `}</style>
      </div>
    )
  }
}
