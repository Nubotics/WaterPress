//lib

import wp, {
  EventApi,
  Api,
  Orm,
  u,

} from './src'
const {_} = u
import chalk from 'chalk'
import stringifyObject from 'stringify-object'

//plugins


//contained context

(function () {

  //tool functions

  const noop = function (next) {
    console.log('done noop')
    next()
  }
  const end = function () {
    console.log('done end')
  }
  const inspectResult = function (err, result) {
    let report = 'result:\n'

    const inspectObject = (object)=> {
      report += `-> ${chalk.green('object returned')}\n`
      report += `--> ${chalk.yellow('keys:')}\n`
      _.mapKeys(object,(value,key)=>{
        report += `---> ${chalk.yellow(key)}\n`
      })
      //TODO: further inspect contents of object
    }
    const inspectArray = (array)=> {
      report += `-> ${chalk.green('array returned')}\n`
      report += `--> ${chalk.magenta('array length:')} ${array.length}\n`
      //TODO: further inspect contents of array

    }
    const inspectValue = (value)=> {
      report += `-> ${chalk.green('value returned')}\n`
      report += `--> ${chalk.cyan('value:')} ${value}\n`
    }

    let stringOpts = {
      indent: '  ',
      singleQuotes: true
    }

    if (err) {
      report += `${chalk.red('err')}\n`
      report += `--> ${stringifyObject(err,stringOpts)}`
    } else if (_.isObject(result)) {
      if (_.isArray(result)) {
        inspectArray(result)
      } else if (_.isPlainObject(result)) {
        inspectObject(result)
      }
    } else {
      inspectValue(result)
    }

    return report

  }

  //test the whole api and plugins in one call

  const options = {
    // base option for eventemitter and chain api
    //base:{},

    // instance option to plug into existing context
    //instance:{connections:{}, collections:{}}

    //db options for creating a fresh context
    db: {
      connections: {
        mysql: {
          adapter: 'mysql',
          host: 'localhost',
          port: 3306,
          user: 'root',
          password: 'root',
          database: 'cms'
        }
      }
    },

    //plugins
    plugins: [],

  }
  const api = wp(options)

  api
    .setOption('isTest', true)
    .connect()

    //plug adhoc queries straight into the api

    .plug((context, next)=> {
      //context = api -> this
      console.log('plug -> context -> ', inspectResult(null, context))
      console.log('\n')
      next()
    })

    //:: Api that have db models

    //post api

    .set('postId', 0)
    .post
    .find({}, {limit: 1, skip: 3}, (err, result, next)=> {
      console.log('post -> find -> ', inspectResult(err, result))
      next()
    })
    .older(100, (err, result, next)=> {
      console.log('post -> older -> ', inspectResult(err, result))
      next()
    })
    .newer(100, (err, result, next)=> {
      console.log('post -> newer -> ', inspectResult(err, result))
      next()
    })
    .one({}, (err, result, next)=> {
      console.log('post -> one -> ', inspectResult(err, result))
      next()
    })
    .save({/* stub post here */}, (err, result, next)=> {
      console.log('post -> save -> ', inspectResult(err, result))
      next()
    })
    .findChildren(100, (err, result, next)=> {
      console.log('post -> findChildren -> ', inspectResult(err, result))
      next()
    })
    .done(next=> {
      console.log('post -> done\n')
      next()
    })

    //user api

    .set('userId', 0)
    .user
    .find({id: {'>': 10}}, (err, result, next)=> {
      console.log('user -> find ->', inspectResult(err, result))
      next()
    })
    .one({id: 1}, (err, result, next)=> {
      console.log('user -> one ->', inspectResult(err, result))
      next()
    })
    .byRole('rolename', (err, result, next)=> {
      console.log('user -> byRole ->', inspectResult(err, result))
      next()
    })
    .existsByEmail('email', (err, result, next)=> {
      console.log('user -> existsByEmail ->', inspectResult(err, result))
      next()
    })
    .save({/* stub user here */}, (err, result, next)=> {
      console.log('user -> save ->', inspectResult(err, result))
      next()
    })
    .checkLogin('email', 'password', (err, result, next)=> {
      console.log('user -> checkLogin ->', inspectResult(err, result))
      next()
    })
    .done(next=> {
      console.log('user -> done\n')
      next()
    })

    //term api

    .set('termId', 0)
    .term
    .find({name: {'contains': 'test'}}, (err, result, next)=> {
      console.log('term -> find ->', inspectResult(err, result))
      next()
    })
    .byTaxonomy({name: {'contains': 'test'}}, (err, result, next)=> {
      console.log('term -> byTaxonomy ->', inspectResult(err, result))
      next()
    })
    .done(next=> {
      console.log('term -> done\n')
      next()
    })

    //comment api

    .set('commentId', 0)
    .comment
    .find({term: {'>': 1}}, (err, result, next)=> {
      console.log('comment -> find ->', inspectResult(err, result))
      next()
    })
    .one({id: 1}, (err, result, next)=> {
      console.log('comment -> one ->', inspectResult(err, result))
      next()
    })
    .save({/* comment stub */}, (err, result, next)=> {
      console.log('comment -> save ->', inspectResult(err, result))
      next()
    })
    .kill(1, (err, result, next)=> {
      console.log('comment -> kill ->', inspectResult(err, result))
      next()
    })
    .done(next=> {
      console.log('comment -> done\n')
      next()
    })

    //:: Api that have assembled models

    //category api

    .set('categoryId', 0)
    .category
    .find({term: {'>': 1}}, false, (err, result, next)=> {
      console.log('category -> find ->', inspectResult(err, result))
      next()
    })
    .one({id: 1}, (err, result, next)=> {
      console.log('category -> one ->', inspectResult(err, result))
      next()
    })
    .done(next=> {
      console.log('category -> done\n')
      next()
    })

    //format api

    .set('postFormat', 'post')
    .format
    .find({}, (err, result, next)=> {
      console.log('format -> find ->', inspectResult(err, result))
      next()
    })
    .done(next=> {
      console.log('format -> done\n')
      next()
    })

    //media api

    .set('mediaId', 0)
    .media
    .find({}, (err, result, next)=> {
      console.log('media -> find ->', inspectResult(err, result))
      next()
    })
    .one({id: 1}, (err, result, next)=> {
      console.log('media -> one ->', inspectResult(err, result))
      next()
    })
    .save({/* media stub */}, (err, result, next)=> {
      console.log('media -> save ->', inspectResult(err, result))
      next()
    })
    .kill(1, (err, result, next)=> {
      console.log('media -> kill ->', inspectResult(err, result))
      next()
    })
    .done(next=> {
      console.log('media -> done\n')
      next()
    })

    //page api

    .set('pageId', 0)
    .page
    .find({}, (err, result, next)=> {
      console.log('page -> find ->', inspectResult(err, result))
      next()
    })
    .one({id: 1}, (err, result, next)=> {
      console.log('page -> one ->', inspectResult(err, result))
      next()
    })
    .save({/* page stub */}, (err, result, next)=> {
      console.log('page -> save ->', inspectResult(err, result))
      next()
    })
    .kill(1, (err, result, next)=> {
      console.log('page -> kill ->', inspectResult(err, result))
      next()
    })
    .done(next=> {
      console.log('page -> done\n')
      next()
    })

    //tag api

    .set('pageId', 0)
    .page
    .find({}, (err, result, next)=> {
      console.log('tag -> find ->', inspectResult(err, result))
      next()
    })
    .one({id: 1}, (err, result, next)=> {
      console.log('tag -> one ->', inspectResult(err, result))
      next()
    })
    .done(next=> {
      console.log('tag -> done\n')
      next()
    })

    // finish up

    .disconnect((next)=> {
      console.log('disconnect')
      next()
    })

  console.log('test executed\n')

})()
