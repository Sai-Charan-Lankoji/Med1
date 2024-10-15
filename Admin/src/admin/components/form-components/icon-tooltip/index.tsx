import React from "react"
import Tooltip, { TooltipProps } from "../../form-organizers/cust-atoms/tooltip"
import AlertIcon from '../../icons/icons/alert-icon';
import InfoIcon from "../../icons/icons/info-icon"
import XCircleIcon from "../../icons/icons/x-circle-icon"
type IconProps = {
  color?: string
  size?: string | number
} & React.SVGAttributes<SVGElement>


type IconTooltipProps = TooltipProps & {
  type?: "info" | "warning" | "error"
} & Pick<IconProps, "size">

const IconTooltip: React.FC<IconTooltipProps> = ({
  type = "info",
  size = 16,
  content,
  ...props
}) => {
  const icon = (type: IconTooltipProps["type"]) => {
    switch (type) {
      case "warning":
        return <AlertIcon size={size} className="text-orange-40 flex" />
      case "error":
        return <XCircleIcon size={size} className="text-rose-40 flex" />
      default:
        return <InfoIcon size={size} className="text-grey-40 flex" />
    }
  }

  return (
    <Tooltip content={content} {...props}>
      {icon(type)}
    </Tooltip>
  )
}

export default IconTooltip
