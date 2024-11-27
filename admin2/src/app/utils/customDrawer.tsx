"use client";
import { ArrowUturnLeft, XMark } from "@medusajs/icons";
import { Badge, Button, Heading, IconButton, Input, Label } from "@medusajs/ui";

const CustomDrawer: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const handleSubmit = (event : any) => {
    event.preventDefault();
    onClose();
  };

  return (
    <div
      className={`absolute top-20 rounded-lg right-0 h-[578px] w-[670px] bg-white shadow-lg z-50 transform ${
        isOpen ? "-translate-x-[468px]" : "translate-x-full"
      } transition-transform duration-300`}
    >
      <div className="p-6 h-full flex flex-col">
        <div className="flex items-center justify-between p-2">
          <div className="flex flex-row justify-center">
            <IconButton onClick={onClose}>
              <ArrowUturnLeft className="h-6 w-6" />
            </IconButton>
            <Heading className="text-[24px] font-semibold text-left px-2">
              Add Custom Item
            </Heading>
          </div>
          <IconButton onClick={onClose}>
            <XMark className="h-6 w-6" />
          </IconButton>
        </div>
        <form className="flex flex-col flex-grow" onSubmit={handleSubmit}>
          <div className="mb-2">
            <Label className="block text-[14px] font-semibold p-2 text-gray-700">
              Title<span className="text-red-500">*</span>
            </Label>
            <Input
              type="text"
              placeholder="E.g. Gift wrapping"
              className="w-full m-2 px-3 py-2 border rounded"
            />
          </div>
          <div className="mb-2 grid grid-cols-2 gap-0">
            <div className="flex-1">
              <Label className="block text-[14px] font-semibold p-2 text-gray-700">
                Currency
              </Label>
              <Badge className="text-[14px] text-left pr-12 m-2">AUD</Badge>
            </div>
            <div className="flex-1 mt-2">
              <Label className="block text-[14px] font-semibold p-2 text-gray-700">
                Price<span className="text-red-500">*</span>
              </Label>
              <Input
                type="number"
                placeholder="$ 0.00"
                className="w-full border rounded"
              />
            </div>
          </div>
          <div className="mb-4">
            <Label className="block text-[14px] font-semibold p-2 text-gray-700">
              Quantity<span className="text-red-500">*</span>
            </Label>
            <div className="flex items-center">
              <Input
                type="number"
                placeholder="1"
                className="w-full px-3 py-2 border rounded"
              />
            </div>
          </div>
          <div className="mt-auto flex justify-between gap-4">
            <Button
              variant="transparent"
              className="px-4 py-2 bg-gray-300 rounded"
              onClick={(event) => {
                event.preventDefault();
                onClose();
              }}
            >
              Back
            </Button>
            <Button
              type="submit"
              variant="transparent"
              className="bg-violet-500 text-slate-100 px-12"
            >
              Add
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CustomDrawer;
