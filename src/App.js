import React, { Component } from 'react'
import ContentLoader from 'react-content-loader'
import { LiveProvider, LiveEditor, LiveError, LivePreview } from 'react-live'
import { Tools } from 'react-sketch'
import { debounce } from 'throttle-debounce'
import Clipboard from 'clipboard'

import { getReactInfo, VueToReact } from './utils'
import { facebook, instagram, code, bulletList } from './utils/presets'
import template, { ReactImport, VueImport } from './utils/template'
import Canvas from './Canvas'
import Config from './Config'
import ReactIcon from './assets/react.svg'
import HeartIcon from './assets/heart.png'
import './App.css'

class App extends Component {
  state = {
    framework: 'vue',
    width: 400,
    height: 200,
    speed: 2,
    primaryColor: '#f3f3f3',
    secondaryColor: '#ecebeb',
    draw: facebook,
    tool: Tools.Select,
    activeItem: false,
    renderCanvas: true,
    focusEditor: false,
  }

  componentDidMount() {
    this.clipboard = new Clipboard('.copy-to-clipboard')
  }

  componentWillUnmount() {
    this.clipboard.destroy()
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.renderCanvas === false && this.state.focusEditor === false) {
      this.setState({ renderCanvas: true })
    }
  }

  _HandleFramework = framework => {
    this.setState({ framework })
  }

  _HandleDraw = draw => {
    this.setState({ draw })
  }

  _HandleEditor = (editor, error) => {
    const hasError = this.editor.state.error === undefined
    if (hasError) {
      const state = getReactInfo(editor, this.state.framework)
      state.renderCanvas = false
      this.setState(state)
    }
  }

  _HandleSelectedItem = activeItem => {
    this.setState({ activeItem })
  }

  _HandleTool = tool => {
    this.setState({ tool })
  }

  _HandlePreset = e => {
    const value = e.target.value
    const height = e.target.dataset.height
    const presents = {
      facebook,
      instagram,
      code,
      bulletList,
    }
    const draw = presents[value]
    this.setState({ draw, height, renderCanvas: false })
  }

  _HandleInput = e => {
    this.__DebouncedHandleInput(e.target.name, e.target.value)
  }

  __DebouncedHandleInput = debounce(250, (name, value) => {
    this.setState({ [name]: value, renderCanvas: false })
  })

  render() {
    const {
      width,
      height,
      speed,
      primaryColor,
      secondaryColor,
      draw,
      framework,
      renderCanvas,
    } = this.state

    const optMycode = {
      data: { width, height, speed, primaryColor, secondaryColor, draw },
      type: framework,
      importDeclaration: false,
    }
    const Mycode = template(optMycode)
    const CopyCodeToClipboard = template({ ...optMycode, importDeclaration: true })

    return (
      <LiveProvider
        code={Mycode}
        scope={{ ContentLoader }}
        ref={r => (this.editor = r)}
        transformCode={code => VueToReact(code, framework)}
      >
        <div className="App">
          <div className="app-header">
            <h1>
              Create <strong>React Content Loader</strong>
            </h1>
            <h2>
              Have you heard about{' '}
              <a href="https://github.com/danilowoz/react-content-loader">react-content-loader</a>?
              It&#39;s React component that uses SVG to<br />
              create loaders which simulates the structure of the content that will be loaded.<br />
              <br />
              <strong>
                So now you can use this tool to create your loader easily.<br />
                <small>
                  You just need to draw using the canvas or code using the live editing!
                </small>
              </strong>
            </h2>
          </div>

          <div>
            <button onClick={() => this._HandleFramework('react')}>React</button>
            <button onClick={() => this._HandleFramework('vue')}>Vue</button>
            <div className="app-editor">
              <span className="app-editor__tab">
                <span />
              </span>
              <span className="copy-to-clipboard" data-clipboard-text={CopyCodeToClipboard}>
                Copy to Clipboard
              </span>

              {framework === 'react' && <ReactImport />}

              <LiveEditor onChange={debounce(500, this._HandleEditor)} />

              {framework === 'vue' && <VueImport />}
            </div>

            <LiveError />

            <div className="app-assign">
              <h2>
                Made with <img src={ReactIcon} alt="React" /> and{' '}
                <img src={HeartIcon} alt="Heart" /> by{' '}
                <a
                  href="https://github.com/danilowoz"
                  target="_blank"
                  without=""
                  rel="noopener noreferrer"
                >
                  @danilowoz
                </a>
              </h2>
              <p>
                Do you have any questions?{' '}
                <a
                  href="https://github.com/danilowoz/react-content-loader"
                  target="_blank"
                  without=""
                  rel="noopener noreferrer"
                >
                  Read the documentation.
                </a>
              </p>
              <br />
              <p className="app-assign__stars">
                Do you like?
                <a
                  className="github-button"
                  href="https://github.com/danilowoz/react-content-loader"
                  data-icon="octicon-star"
                  data-show-count="true"
                  aria-label="Star danilowoz/react-content-loader on GitHub"
                  target="_blank"
                  without=""
                  rel="noopener noreferrer"
                >
                  react-content-loader
                </a>
                <a
                  className="github-button"
                  href="https://github.com/danilowoz/create-react-content-loader"
                  data-icon="octicon-star"
                  data-show-count="true"
                  aria-label="Star danilowoz/create-react-content-loader on GitHub"
                  target="_blank"
                  without=""
                  rel="noopener noreferrer"
                >
                  create-react-content-loader
                </a>
              </p>
            </div>
          </div>

          <div>
            {renderCanvas && (
              <Canvas
                {...this.state}
                _HandleDraw={this._HandleDraw}
                _HandleSelectedItem={this._HandleSelectedItem}
                _HandleTool={this._HandleTool}
                _HandlePreset={this._HandlePreset}
              >
                <LivePreview
                  style={{ width: `${this.state.width}px`, height: `${this.state.height}px` }}
                />
              </Canvas>
            )}
            <Config {...this.state} _HandleInput={this._HandleInput} />
          </div>
        </div>
      </LiveProvider>
    )
  }
}

export default App
