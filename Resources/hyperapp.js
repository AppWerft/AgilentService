@import("Foundation");
@import("UIKit");
@import("CoreGraphics");
var window = UIApplication.sharedApplication().keyWindow;
var view = new UIView();
view.frame = UIScreen.mainScreen().applicationFrame;
@class('ButtonHandler', NSObject, [], [
        {
                name: 'buttonClick',
                returnType: 'void',
                arguments: [],
                action: function() {
                        console.log('clicked button');
                }
        }
]);
var handler = new ButtonHandler();
var button = UIButton.alloc().initWithFrame(CGRectMake(110, 100, 200, 44));
button.setTitle("Drück mich fest!", UIControlStateNormal);
button.setTitleColor(UIColor.darkTextColor(), UIControlStateNormal);
button.addTarget(handler, NSSelectorFromString('buttonClick'), UIControlEventTouchDown);
window.addSubview(view);
view.addSubview(button);

