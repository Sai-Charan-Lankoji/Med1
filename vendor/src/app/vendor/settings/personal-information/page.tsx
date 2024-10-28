'use client'

import { useAuth } from "@/app/context/AuthContext"
import { BackButton } from "@/app/utils/backButton"
import { getColors } from "@/app/utils/dummyData"
import { LanguageSelect } from "@/app/utils/languageSelect"
import { XMarkMini } from "@medusajs/icons"
import {
  Button,
  Container,
  Heading,
  IconButton,
  Input,
  Label,
  Text,
  Tooltip,
  Switch,
} from "@medusajs/ui"
import React, { useState } from "react"
import withAuth from "@/lib/withAuth"

const PersonalInformation = () => {
  const { email } = useAuth() ?? { email: "Default Email" }
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isModalOpen2, setIsModalOpen2] = useState(false)
  const openModal2 = () => setIsModalOpen2(true)
  const closeModal2 = () => setIsModalOpen2(false)
  const openModal = () => setIsModalOpen(true)
  const closeModal = () => setIsModalOpen(false)
  const [isToggledSwitch1, setIsToggledSwitch1] = useState(false)
  const [isToggledSwitch2, setIsToggledSwitch2] = useState(false)

  if (!email) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="w-12 h-12 border-4 border-violet-500 border-t-transparent border-solid rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="bg-grey-5 min-h-screen">
      <Container className="max-w-[1280px] w-full mx-auto px-8 py-6">
        <BackButton name="Settings" />
        <div className="bg-white rounded-lg  mt-6">
          <div className="p-8 pb-0">
            <Heading level="h1" className="text-grey-90 mb-2">Personal Information</Heading>
            <Text className="text-grey-50">Manage your Medusa profile</Text>
          </div>
          <div className="p-8 pt-0">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between py-6 border-b border-grey-20">
              <div className="flex items-center mb-4 md:mb-0">
                <div
                  className={`w-12 h-12 md:w-16 md:h-16 flex text-2xl md:text-4xl items-center justify-center rounded-full text-white
                    ${getColors(2)}`}
                >
                  {email.charAt(0)}
                </div>
                <Text className="text-grey-90 ml-4">{email}</Text>
              </div>
              <Button variant="secondary" size="small" onClick={openModal}>
                Edit Information
              </Button>
            </div>
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between py-6 border-b border-grey-20">
              <div>
                <Text className="text-grey-90 font-medium">Language</Text>
                <Text className="text-grey-50 text-sm mt-1">
                  Adjust the language of Medusa Admin
                </Text>
              </div>
              <div className="w-full md:w-auto mt-4 md:mt-0">
                <LanguageSelect />
              </div>
            </div>
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between py-6">
              <div>
                <Text className="text-grey-90 font-medium">Usage insights</Text>
                <Text className="text-grey-50 text-sm mt-1">
                  Share usage insights and help us improve Medusa
                </Text>
              </div>
              <Button variant="secondary" size="small" onClick={openModal2}>
                Edit preferences
              </Button>
            </div>
          </div>
        </div>
      </Container>
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-40 flex justify-center items-center p-4 z-50">
          <div className="bg-white rounded-lg p-8 w-full max-w-md  shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <Heading level="h2" className="text-grey-90">Edit information</Heading>
              <IconButton variant="transparent" onClick={closeModal}>
                <XMarkMini />
              </IconButton>
            </div>
            <form>
              <div className="grid gap-y-4">
                <div>
                  <Label htmlFor="firstName" className="text-grey-50 mb-1">First name</Label>
                  <Input id="firstName" type="text" placeholder="First name" required />
                </div>
                <div>
                  <Label htmlFor="lastName" className="text-grey-50 mb-1">Last name</Label>
                  <Input id="lastName" type="text" placeholder="Last name" required />
                </div>
              </div>
              <div className="flex justify-end space-x-2 mt-8">
                <Button variant="secondary" onClick={closeModal}>Cancel</Button>
                <Button variant="primary">Submit and close</Button>
              </div>
            </form>
          </div>
        </div>
      )}
      {isModalOpen2 && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-40 flex justify-center items-center p-4 z-50">
          <div className="bg-white rounded-lg p-8 w-full max-w-2xl">
            <div className="flex justify-between items-center mb-6">
              <Heading level="h2" className="text-grey-90">Edit preferences</Heading>
              <IconButton variant="transparent" onClick={closeModal2}>
                <XMarkMini />
              </IconButton>
            </div>
            <form>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Text className="text-grey-90 font-medium">Anonymize my usage data</Text>
                    <Text className="text-grey-50 text-sm mt-1 max-w-sm break-words">
                      You can choose to anonymize your usage data. If this
                      option is selected, we will not collect your personal
                      information, such as your name and email address.
                    </Text>
                  </div>
                  <Tooltip content={isToggledSwitch1 ? "Disable" : "Enable"}>
                    <Switch checked={isToggledSwitch1} onCheckedChange={setIsToggledSwitch1} />
                  </Tooltip>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Text className="text-grey-90 font-medium">Opt out of sharing my usage data</Text>
                    <Text className="text-grey-50 text-sm mt-1">
                      You can always opt out of sharing your usage data at any time.
                    </Text>
                  </div>
                  <Tooltip content={isToggledSwitch2 ? "Disable" : "Enable"}>
                    <Switch checked={isToggledSwitch2} onCheckedChange={setIsToggledSwitch2} />
                  </Tooltip>
                </div>
              </div>
              <div className="flex justify-end space-x-2 mt-8">
                <Button variant="secondary" onClick={closeModal2}>Cancel</Button>
                <Button variant="primary">Submit and close</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default withAuth(PersonalInformation)