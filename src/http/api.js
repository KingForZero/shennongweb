/*
 * 接口统一集成模块
 */
import * as login from './moudules/login'
import * as user from './moudules/user'
import * as dept from './moudules/dept'
import * as role from './moudules/role'
import * as menu from './moudules/menu'
import * as dict from './moudules/dict'
import * as log from './moudules/log'
import * as department from './moudules/department'
import * as assistant from './moudules/assistant'
import * as healthHouseKeeper from './moudules/healthHouseKeeper'
import * as pharmacy from './moudules/pharmacy'
import * as doctor from './moudules/doctor'
import * as project from './moudules/project'
import * as portalmanage from './moudules/portalmanage'
import * as gongZhongHao from './moudules/gongZhongHao'
import * as physique from './moudules/physique'
import * as yingyang from './moudules/yingyang'
import * as chanpin from './moudules/chanpin'

// 默认全部导出
export default {
    login,
    user,
    dept,
    role,
    menu,
    dict,
    log,
    department,
    assistant,
    healthHouseKeeper,
	  pharmacy,
    doctor,
    project,
    portalmanage,
    gongZhongHao,
    physique,
    yingyang,
    chanpin

}
