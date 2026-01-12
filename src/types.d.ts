export interface Player {
  /** Unique ID of the Player. */
  ID: string
  /** Name of the Player. */
  Name: string
  /** Class Name of the Player. */
  ClassName: string
  /** Location of the Player. */
  location: Location
  /** Rotation of the Actor (0 - 399, 0 = North, 90 = East, 180 = South, 270 = West). */
  rotation: number
  /** HP of the Player. */
  PlayerHP: number
  /** Speed of the Player. */
  Speed: number
  /** Is the player online? */
  Online: boolean
  /** Is the player dead? */
  Dead: boolean
  /** A list of items. */
  Inventory: InventoryItem[]
  /** An object with actor coordinates and name information. */
  features: Features
}

export interface Power {
  /** ID of the circuit. */
  CircuitGroupID: number

  /** Power production of the circuit. */
  PowerProduction: number

  /** Power consumed on power circuit. */
  PowerConsumed: number

  /** Power capacity on power circuit. */
  PowerCapacity: number

  /** Maximum Power that can be consumed on power circuit. */
  PowerMaxConsumed: number

  /** The combined power input to all the batteries connected to this circuit. Negative values denote power output. */
  BatteryInput: number

  /** The combined power output from all the batteries connected to this circuit. */
  BatteryOutput: number

  /** Amount of power in excess/deficit going into or out of the batteries. Positive = Charges batteries, Negative = Drains batteries */
  BatteryDifferential: number

  /** Percentage of batteries. */
  BatteryPercent: number

  /** Total capacity of batteries. */
  BatteryCapacity: number

  /** Time until Batteries are empty. Format: Hours:Minutes:Seconds */
  BatteryTimeEmpty: string

  /** Time until Batteries are full. Format: Hours:Minutes:Seconds */
  BatteryTimeFull: string

  /** All the circuit IDs that this group owns. */
  AssociatedCircuits: number[]

  /** Has the fuse been triggered? */
  FuseTriggered: boolean
}

interface Generator {
  /** Unique ID of the Generator. */
  ID: string
  /** Name of the Generator. */
  Name: string
  /** ClassName of the Generator. */
  ClassName: string
  /** Location details of the Generator. */
  Location: Location
  /** Connected Circuit Number */
  CircuitID: number
  /** Base Power Production */
  BaseProd: number
  /** Production Capacity */
  DynamicProdCapacity: number
  /** Production Demand Factor */
  DynamicProdDemandFactor: number
  /** Regulated Production */
  RegulatedDemandProd: number
  /** Generator Running at Full Blast */
  IsFullBlast: boolean
  /** Can Generator Start */
  CanStart: boolean
  /** Produced Power being Consumed */
  ProdPowerConsumption: number
  /** Speed Potential (Power Slug) */
  CurrentPotential: number
  /** Production Capacity */
  ProductionCapacity: number
  /** Default Production Capacity */
  DefaultProductionCapacity: number
  /** Max Current Power Potential */
  PowerProductionPotential: number
  /** Fuel Inventory */
  FuelAmount: number
  /** Supplemental Fuel Object */
  Supplement: Supplement
  /** Fuel Type in Inventory */
  FuelResource: number
  /** Nuclear Power System Alarm (Nuclear Reactors Only) */
  NuclearWarning?: string
  /** Minimum Power Generated (Geothermal Generators Only) */
  GeoMinPower?: number
  /** Maximum Power Generated (Geothermal Generators Only) */
  GeoMaxPower?: number
  /** Available Fuel Object */
  AvailableFuel: AvailableFuel
  /** Waste Inventory Object */
  WasteInventory: InventoryItem
  FuelInventory: InventoryItem
  /** Bounding Box information about the Actor. */
  BoundingBox: BoundingBox
  PowerInfo: {
    CircuitGroupID: number
    CircuitID: number
    FuseTriggered: boolean
    PowerConsumed: number
    MaxPowerConsumed: number
  }
  /** An object with actor coordinates and name information. */
  features: Features
}

export interface SessionInfo {
  SessionName: string
  IsPaused: boolean
  DayLength: number
  NightLength: number
  PassedDays: number
  NumberOfDaysSinceLastDeath: number
  Hours: number
  Minutes: number
  Seconds: number
  IsDay: boolean
  TotalPlayDuration: number
  TotalPlayDurationText: string
}

export interface Sink {
  Name: string
  ClassName: string
  CouponType: {
    Name: string
    ClassName: string
  }
  NumCoupon: number
  Percent: number
  GraphPoints: number[]
  TotalPoints: number
  PointsToCoupon: number
}

export interface ProdStat {
  Name: string
  ClassName: string
  ProdPerMin: string
  ProdPercent: number
  ConsPercent: number
  CurrentProd: number
  MaxProd: number
  CurrentConsumed: number
  MaxConsumed: number
  Type: string
}
export interface ResourceNode {
  ID: string
  Name: string
  ClassName: string
  Purity: 'Impure' | 'Normal' | 'Pure'
  EnumPurity: string
  ResourceForm: 'Liquid' | 'Gas' | 'Solid'
  NodeType: string
  Exploited: boolean
  location: Location
  features: Features
}
export interface Location {
  x: number
  y: number
  z: number
  rotation: number
}
/**
 * Дополнительное топливо
 */
interface Supplement {
  /** Supplement Resource Used (usually water) */
  Name: string
  /** UE Class Name */
  ClassName: string
  /** Rate of Supplement Consumption */
  CurrentConsumed: number
  /** Max Rate of Supplement Consumption */
  MaxConsumed: number
  /** Inventory Used of Supplement Storage (in %) */
  PercentFull: number
}

/**
 * Доступное топливо
 */
interface AvailableFuel {
  /** Acceptable Fuel */
  Name: string
  /** UE Class Name */
  ClassName: string
  /** Energy Value of Fuel Used in calculations (MW for Potential / (Energy Value Adjusted by Form) * 60) */
  EnergyValue: string
}

interface InventoryItem {
  /** Name of the item. */
  Name: string
  /** Class Name of the item. */
  ClassName: string
  /** Amount of the item. */
  Amount: number
  /** Stack size of the item. */
  MaxAmount: number
}

interface Coordinates {
  /** X Location of the Actor. */
  x: number
  /** Y Location of the Actor. */
  y: number
  /** Z Location of the Actor. */
  z: number
  /** It’s always "Point". */
  type: string
}

interface Geometry {
  /** The Actor coordinates. */
  coordinates: Coordinates
}

interface Properties {
  /** Display Name of the Actor. */
  name: string
  /** Type of the Object. */
  type: string
}

interface Features {
  /** Geometry information about the Actor. */
  geometry: Geometry
  /** Name information about the actor. */
  properties: Properties
}

export interface SocketAnswer {
  endpoint:
    | 'getPlayer'
    | 'getPower'
    | 'getGenerators'
    | 'getSessionInfo'
    | 'getResourceSink'
    | 'getExplorationSink'
    | 'getProdStats'
    | 'getResourceNode'
  data: Array<T>
}

/**
 * Границы ограничивающей рамки
 */
interface BoundingBoxBounds {
  /** Value along the X-axis. */
  x: number
  /** Value along the Y-axis. */
  y: number
  /** Value along the Z-axis. */
  z: number
}

/**
 * Ограничивающая рамка объекта
 */
interface BoundingBox {
  /** The minimum boundary of the bounding box in the corresponding axis. */
  min: BoundingBoxBounds
  /** The maximum boundary of the bounding box in the corresponding axis. */
  max: BoundingBoxBounds
}
