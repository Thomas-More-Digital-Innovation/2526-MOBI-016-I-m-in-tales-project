import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './app/page'
import MakeStory from './app/makeStory/page'
import ManageStory from './app/manageStory/page'
import StoryOverview from './app/storyOverview/page'
import PlayStory from './app/playStory/page'
import Help from './app/help/page'
import TestBoard from './app/testBoard/page'
import StoryConfigurator from './app/makeStory/storyConfigurator/page'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/makeStory" element={<MakeStory />} />
        <Route path="/manageStory" element={<ManageStory />} />
        <Route path="/makeStory/storyConfigurator/:folderName" element={<StoryConfigurator />} />
        <Route path="/storyOverview" element={<StoryOverview mode={'view'} />} /> {/* TODO: revisit when edit mode is implemented */}
        <Route path="/playStory/:id" element={<PlayStory />} />
        <Route path="/help" element={<Help />} />
        <Route path="/testBoard" element={<TestBoard />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
