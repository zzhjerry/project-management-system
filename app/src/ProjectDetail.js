import React from 'react'

const ProjectDetail = ({ match }) => {
  return (
    <div>{match.params.slug}</div>
  )
}

export default ProjectDetail
