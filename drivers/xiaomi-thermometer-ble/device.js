'use strict';

const { Device } = require('homey');

class MyDevice extends Device {

  /**
   * onInit is called when the device is initialized.
   */
  async onInit() {
    this.log('MyDevice has been initialized');
    console.log(this.getData());
    this.addListener('updateTag', this.updateTag);
  }

  /**
   * onAdded is called when the user adds the device, called just after pairing.
   */
  async onAdded() {
    this.log('MyDevice has been added');
    
  }

  /**
   * onSettings is called when the user updates the device's settings.
   * @param {object} event the onSettings event data
   * @param {object} event.oldSettings The old settings object
   * @param {object} event.newSettings The new settings object
   * @param {string[]} event.changedKeys An array of keys changed since the previous version
   * @returns {Promise<string|void>} return a custom message that will be displayed
   */
  async onSettings({ oldSettings, newSettings, changedKeys }) {
    this.log('MyDevice settings where changed');
  }

  /**
   * onRenamed is called when the user updates the device's name.
   * This method can be used this to synchronise the name to the device.
   * @param {string} name The new name
   */
  async onRenamed(name) {
    this.log('MyDevice was renamed');
  }

  /**
   * onDeleted is called when the user deleted the device.
   */
  async onDeleted() {
    this.log('MyDevice has been deleted');
  }


  async updateTag(foundDevices) {
    console.log(`Updating measurements ${this.getName()}`);
    let deviceData = this.getData();
    let settings = this.getSettings();
    let mac = this.getData();

      foundDevices.forEach(device => {
        if(device.address==mac["id"]){
          console.log("Match!", mac, device.address);
          const sdata = device.serviceData;
          sdata.forEach(uuid => {
            if(uuid.uuid=="181a"){
              var datas = uuid["data"];
              const dattta = Buffer.from(uuid["data"],'hex');
              const rawValue = ((dattta[6] << 8) | dattta[7]);
              console.log(device.localName)
              console.log("Temp: ",(((rawValue & 0x8000) ? -0x8000 : 0) + (rawValue & 0x7FFF)) / 10, "Celsius");
              console.log("Hum: ",dattta[8],"%");
              console.log("Batt: ",dattta[9],"%");
              console.log("");
              let temperature = (((rawValue & 0x8000) ? -0x8000 : 0) + (rawValue & 0x7FFF)) / 10;
              let humidity = dattta[8];
              let battery = dattta[9];
              this.setCapabilityValue('measure_temperature', temperature);
              this.setCapabilityValue('measure_humidity', humidity);
              this.setCapabilityValue('measure_battery', battery);
            }
          })
        } else {
          //throw new Error("The device could not be found!");
        }
    })

  }

}
function readTemperature(buffer) {
  const data = Buffer.from(uuid["data"],'hex');
  const rawValue = ((data[6] << 8) | data[7]);
  const value = (((rawValue & 0x8000) ? -0x8000 : 0) + (rawValue & 0x7FFF)) / 10;
  console.log(((data[6] << 8) | data[7]) / 10), "readtemperature";
  return (value);
}
module.exports = MyDevice;
